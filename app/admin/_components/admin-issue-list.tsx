import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminIssueCard } from './admin-issue-card';

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

const getIssues = cache(async () => {
  const supabase = await createClient();

  return await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
});

export async function AdminIssueList() {
  const { data: issues, error } = await getIssues();

  if (error) {
    console.error('Error fetching issues:', error);
    return (
      <div className="border rounded-lg p-8 text-center text-red-500">
        <p>Failed to load issues.</p>
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>No issues reported yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <AdminIssueCard key={issue.id} issue={issue as Issue} />
      ))}
    </div>
  );
}
