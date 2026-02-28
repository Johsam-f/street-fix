import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ShoutoutCard } from './shoutout-card';

type Shoutout = {
  id: string;
  from_user_id: string;
  to_user_name: string;
  message: string;
  created_at: string;
};

const getShoutouts = cache(async () => {
  const supabase = await createClient();

  return await supabase
    .from('shoutouts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
});

export async function ShoutoutList() {
  const { data: shoutouts, error } = await getShoutouts();

  if (error) {
    console.error('Error fetching shoutouts:', error);
    return (
      <div className="border rounded-lg p-8 text-center text-red-500">
        <p>Failed to load shoutouts. Please try again later.</p>
      </div>
    );
  }

  if (!shoutouts || shoutouts.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>No shoutouts yet.</p>
        <p className="text-sm mt-2">Be the first to appreciate a neighbor!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shoutouts.map((shoutout) => (
        <ShoutoutCard key={shoutout.id} shoutout={shoutout as Shoutout} />
      ))}
    </div>
  );
}
