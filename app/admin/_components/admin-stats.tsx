import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { AlertCircle, MapPin, MessageSquare, Heart } from 'lucide-react';

const getStats = cache(async () => {
  const supabase = await createClient();

  const [issuesResult, resourcesResult, postsResult, shoutoutsResult] = await Promise.all([
    supabase.from('issues').select('status', { count: 'exact' }),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
    supabase.from('shoutouts').select('*', { count: 'exact', head: true }),
  ]);

  const openIssues = issuesResult.data?.filter((i) => i.status === 'open').length || 0;
  const inProgressIssues = issuesResult.data?.filter((i) => i.status === 'in_progress').length || 0;
  const resolvedIssues = issuesResult.data?.filter((i) => i.status === 'resolved').length || 0;

  return {
    totalIssues: issuesResult.count || 0,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    totalResources: resourcesResult.count || 0,
    totalPosts: postsResult.count || 0,
    totalShoutouts: shoutoutsResult.count || 0,
  };
});

export async function AdminStats() {
  const stats = await getStats();

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-lg">Issues</h3>
        </div>
        <p className="text-3xl font-bold">{stats.totalIssues}</p>
        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Open:</span>
            <span className="font-medium text-red-600">{stats.openIssues}</span>
          </div>
          <div className="flex justify-between">
            <span>In Progress:</span>
            <span className="font-medium text-yellow-600">{stats.inProgressIssues}</span>
          </div>
          <div className="flex justify-between">
            <span>Resolved:</span>
            <span className="font-medium text-green-600">{stats.resolvedIssues}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg">Resources</h3>
        </div>
        <p className="text-3xl font-bold">{stats.totalResources}</p>
        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
          Taps, clinics, waste points
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg">Forum Posts</h3>
        </div>
        <p className="text-3xl font-bold">{stats.totalPosts}</p>
        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
          Community discussions
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="font-semibold text-lg">Shoutouts</h3>
        </div>
        <p className="text-3xl font-bold">{stats.totalShoutouts}</p>
        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
          Neighbor appreciation
        </p>
      </Card>
    </div>
  );
}
