'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const getUser = cache(async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
});

export type CreateIssueInput = {
  title: string;
  description: string;
  category: 'water' | 'sanitation' | 'waste' | 'other';
  latitude: number;
  longitude: number;
  locationName?: string;
  imageData?: {
    base64: string;
    fileName: string;
    fileType: string;
  };
};

export async function createIssue(input: CreateIssueInput) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to report an issue' };
  }

  try {
    let imageUrl: string | null = null;

    // Upload image if provided
    if (input.imageData) {
      const { base64, fileName, fileType } = input.imageData;
      
      // Convert base64 to buffer
      const base64Data = base64.split(',')[1]; // Remove data:image/xxx;base64, prefix
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileExt = fileName.split('.').pop();
      const uniqueFileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `issue-images/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('issue-images')
        .upload(filePath, buffer, {
          contentType: fileType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { error: `Failed to upload image: ${uploadError.message}` };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('issue-images').getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Create issue record
    const { data, error } = await supabase
      .from('issues')
      .insert([
        {
          user_id: user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          latitude: input.latitude,
          longitude: input.longitude,
          location_name: input.locationName || null,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating issue:', error);
      return { error: 'Failed to create issue' };
    }

    // Revalidate the issues page to show the new issue
    revalidatePath('/issues');

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
