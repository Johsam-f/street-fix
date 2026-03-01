import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminResourceCard } from './admin-resource-card';

type Resource = {
  id: string;
  name: string;
  type: 'water' | 'clinic' | 'waste_collection' | 'other';
  latitude: number;
  longitude: number;
  location_name: string | null;
  description: string | null;
  contact: string | null;
  created_at: string;
};

const getResources = cache(async () => {
  const supabase = await createClient();

  return await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });
});

export async function AdminResourceList() {
  const { data: resources, error } = await getResources();

  if (error) {
    console.error('Error fetching resources:', error);
    return (
      <div className="border rounded-lg p-8 text-center text-red-500">
        <p>Failed to load resources.</p>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>No resources added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <AdminResourceCard key={resource.id} resource={resource as Resource} />
      ))}
    </div>
  );
}
