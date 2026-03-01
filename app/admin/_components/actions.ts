'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const getUser = cache(async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
});

const checkAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return { isAdmin: profile?.is_admin || false, error: null };
};

export type UpdateIssueStatusInput = {
  issueId: string;
  status: 'open' | 'in_progress' | 'resolved';
};

export type CreateResourceInput = {
  name: string;
  type: 'water' | 'clinic' | 'waste_collection' | 'other';
  latitude: number;
  longitude: number;
  locationName?: string;
  description?: string;
  contact?: string;
};

export type UpdateResourceInput = CreateResourceInput & {
  id: string;
};

export async function updateIssueStatus(input: UpdateIssueStatusInput) {
  const { isAdmin, error } = await checkAdmin();

  if (error || !isAdmin) {
    return { error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  try {
    const { data, error: updateError } = await supabase
      .from('issues')
      .update({ status: input.status, updated_at: new Date().toISOString() })
      .eq('id', input.issueId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating issue status:', updateError);
      return { error: 'Failed to update issue status' };
    }

    revalidatePath('/admin');
    revalidatePath('/issues');
    revalidatePath('/map');
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function createResource(input: CreateResourceInput) {
  const { isAdmin, error } = await checkAdmin();

  if (error || !isAdmin) {
    return { error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  try {
    const { data, error: createError } = await supabase
      .from('resources')
      .insert({
        name: input.name,
        type: input.type,
        latitude: input.latitude,
        longitude: input.longitude,
        location_name: input.locationName,
        description: input.description,
        contact: input.contact,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating resource:', createError);
      return { error: 'Failed to create resource' };
    }

    revalidatePath('/admin');
    revalidatePath('/map');
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateResource(input: UpdateResourceInput) {
  const { isAdmin, error } = await checkAdmin();

  if (error || !isAdmin) {
    return { error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  try {
    const { data, error: updateError } = await supabase
      .from('resources')
      .update({
        name: input.name,
        type: input.type,
        latitude: input.latitude,
        longitude: input.longitude,
        location_name: input.locationName,
        description: input.description,
        contact: input.contact,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating resource:', updateError);
      return { error: 'Failed to update resource' };
    }

    revalidatePath('/admin');
    revalidatePath('/map');
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteResource(resourceId: string) {
  const { isAdmin, error } = await checkAdmin();

  if (error || !isAdmin) {
    return { error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  try {
    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (deleteError) {
      console.error('Error deleting resource:', deleteError);
      return { error: 'Failed to delete resource' };
    }

    revalidatePath('/admin');
    revalidatePath('/map');
    return { error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function deleteIssue(issueId: string) {
  const { isAdmin, error } = await checkAdmin();

  if (error || !isAdmin) {
    return { error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  try {
    // First, get the issue to check if it has an image
    const { data: issue, error: fetchError } = await supabase
      .from('issues')
      .select('image_url')
      .eq('id', issueId)
      .single();

    if (fetchError) {
      console.error('Error fetching issue:', fetchError);
      return { error: 'Failed to fetch issue' };
    }

    // Delete the image from storage if it exists
    if (issue?.image_url) {
      try {
        // Extract the file path from the public URL
        // URL format: https://xxx.supabase.co/storage/v1/object/public/issue-images/filename
        const url = new URL(issue.image_url);
        const pathParts = url.pathname.split('/');
        const filePathIndex = pathParts.indexOf('issue-images');
        
        if (filePathIndex !== -1) {
          const filePath = pathParts.slice(filePathIndex).join('/');
          
          const { error: storageError } = await supabase.storage
            .from('issue-images')
            .remove([filePath]);

          if (storageError) {
            console.error('Error deleting image from storage:', storageError);
            // Continue with issue deletion even if image deletion fails
          }
        }
      } catch (urlError) {
        console.error('Error parsing image URL:', urlError);
        // Continue with issue deletion even if image deletion fails
      }
    }

    // Delete the issue record
    const { error: deleteError } = await supabase
      .from('issues')
      .delete()
      .eq('id', issueId);

    if (deleteError) {
      console.error('Error deleting issue:', deleteError);
      return { error: 'Failed to delete issue' };
    }

    revalidatePath('/admin');
    revalidatePath('/issues');
    revalidatePath('/map');
    return { error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
