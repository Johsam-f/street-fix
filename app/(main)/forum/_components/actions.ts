'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const getUser = cache(async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
});

export type CreatePostInput = {
  title: string;
  content: string;
  category: 'tips' | 'emergency' | 'general';
};

export type CreateReplyInput = {
  postId: string;
  content: string;
};

export async function createPost(input: CreatePostInput) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to create a post' };
  }

  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: user.id,
        title: input.title,
        content: input.content,
        category: input.category,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { error: 'Failed to create post' };
    }

    revalidatePath('/forum');
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function createReply(input: CreateReplyInput) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to reply' };
  }

  try {
    const { data, error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: input.postId,
        user_id: user.id,
        content: input.content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reply:', error);
      return { error: 'Failed to create reply' };
    }

    revalidatePath('/forum');
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
