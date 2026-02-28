'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const getUser = cache(async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
});

export type CreateShoutoutInput = {
  toUserName: string;
  message: string;
};

export async function createShoutout(input: CreateShoutoutInput) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to give a shoutout' };
  }

  try {
    const { data, error } = await supabase
      .from('shoutouts')
      .insert({
        from_user_id: user.id,
        to_user_name: input.toUserName,
        message: input.message,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating shoutout:', error);
      return { error: 'Failed to create shoutout' };
    }

    revalidatePath('/shoutouts');
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
