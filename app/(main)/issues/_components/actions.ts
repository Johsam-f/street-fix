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
      try {
        const { base64, fileName, fileType } = input.imageData;
        
        // Extract base64 data (remove data:image/xxx;base64, prefix)
        const base64Data = base64.includes(',') 
          ? base64.split(',')[1] 
          : base64;

        // Validate base64 data
        if (!base64Data || base64Data.length === 0) {
          return { error: 'Invalid image data' };
        }

        // Convert base64 to buffer
        let buffer: Buffer;
        try {
          buffer = Buffer.from(base64Data, 'base64');
        } catch (bufferError) {
          console.error('Buffer conversion error:', bufferError);
          return { error: 'Failed to process image data' };
        }

        const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
        const uniqueFileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `issues/${uniqueFileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('issue-images')
          .upload(filePath, buffer, {
            contentType: fileType,
            upsert: false,
            cacheControl: '3600',
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          return { error: `Failed to upload image: ${uploadError.message || 'Unknown error'}` };
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('issue-images').getPublicUrl(filePath);

        if (!publicUrl) {
          return { error: 'Failed to generate image URL' };
        }

        imageUrl = publicUrl;
      } catch (imageError) {
        console.error('Unexpected image processing error:', imageError);
        return { error: 'Failed to process image. Please try again.' };
      }
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
