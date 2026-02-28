import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ForumPostCard } from './forum-post-card';

type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: 'tips' | 'emergency' | 'general';
  created_at: string;
  user_id: string;
};

type ForumPostListProps = {
  category?: string;
};

const getPosts = cache(async (category?: string) => {
  const supabase = await createClient();

  let query = supabase
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Apply category filter
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  return await query;
});

const getReplyCount = async (postId: string) => {
  const supabase = await createClient();
  const { count } = await supabase
    .from('forum_replies')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
  return count || 0;
};

export async function ForumPostList({ category }: ForumPostListProps) {
  const { data: posts, error } = await getPosts(category);

  if (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="border rounded-lg p-8 text-center text-red-500">
        <p>Failed to load posts. Please try again later.</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>No posts yet.</p>
        <p className="text-sm mt-2">Be the first to start a conversation!</p>
      </div>
    );
  }

  // Get reply counts for each post
  const postsWithReplies = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      reply_count: await getReplyCount(post.id),
    }))
  );

  return (
    <div className="space-y-4">
      {postsWithReplies.map((post) => (
        <ForumPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
