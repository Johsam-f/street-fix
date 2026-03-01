'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type MapIssue = {
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
};

export const getMapIssues = cache(async () => {
  const supabase = await createClient();

  const { data: issues, error } = await supabase
    .from('issues')
    .select('id, title, description, category, status, latitude, longitude, location_name, image_url, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching issues:', error);
    return [];
  }

  return issues as MapIssue[];
});
