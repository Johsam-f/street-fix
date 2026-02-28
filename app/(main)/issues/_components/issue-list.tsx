import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { IssueCard } from './issue-card';

type Issue = {
  id: string;
  title: string;
  description: string;
  category: 'water' | 'sanitation' | 'waste' | 'other';
  status: 'open' | 'in_progress' | 'resolved';
  latitude: number;
  longitude: number;
  location_name: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
};

type IssueListProps = {
  category?: string;
  status?: string;
};

const getIssues = cache(async (category?: string, status?: string) => {
  const supabase = await createClient();

  let query = supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Apply filters
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  return await query;
});

export async function IssueList({ category, status }: IssueListProps) {
  const { data: issues, error } = await getIssues(category, status);

  if (error) {
    console.error('Error fetching issues:', error);
    return (
      <div className="border rounded-lg p-8 text-center text-red-500">
        <p>Failed to load issues. Please try again later.</p>
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>No issues reported yet.</p>
        <p className="text-sm mt-2">Be the first to report an issue!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue as Issue} />
      ))}
    </div>
  );
}
