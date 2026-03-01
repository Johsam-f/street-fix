'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteResource } from './actions';
import { toast } from 'sonner';
import { MapPin, Trash2 } from 'lucide-react';

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

type AdminResourceCardProps = {
  resource: Resource;
};

const typeColors = {
  water: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  clinic: 'bg-red-500/10 text-red-700 dark:text-red-400',
  waste_collection: 'bg-green-500/10 text-green-700 dark:text-green-400',
  other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

const typeLabels = {
  water: 'Water',
  clinic: 'Clinic',
  waste_collection: 'Waste Collection',
  other: 'Other',
};

export function AdminResourceCard({ resource }: AdminResourceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteResource(resource.id);
    setIsDeleting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Resource deleted successfully');
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{resource.name}</h3>
            <Badge className={typeColors[resource.type]} variant="secondary">
              {typeLabels[resource.type]}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {resource.description && (
          <p className="text-muted-foreground">{resource.description}</p>
        )}

        {resource.location_name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{resource.location_name}</span>
          </div>
        )}

        {resource.contact && (
          <p className="text-sm">
            <span className="font-medium">Contact:</span> {resource.contact}
          </p>
        )}
      </div>
    </Card>
  );
}
