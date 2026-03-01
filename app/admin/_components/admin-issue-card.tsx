'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateIssueStatus, deleteIssue } from './actions';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Trash2 } from 'lucide-react';

type Issue = {
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

type AdminIssueCardProps = {
  issue: Issue;
};

const categoryColors = {
  water: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  sanitation: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  waste: 'bg-green-500/10 text-green-700 dark:text-green-400',
  other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

const statusColors = {
  open: 'bg-red-500/10 text-red-700 dark:text-red-400',
  in_progress: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  resolved: 'bg-green-500/10 text-green-700 dark:text-green-400',
};

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export function AdminIssueCard({ issue }: AdminIssueCardProps) {
  const [currentStatus, setCurrentStatus] = useState(issue.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusUpdate = async (newStatus: 'open' | 'in_progress' | 'resolved') => {
    setIsUpdating(true);
    const result = await updateIssueStatus({ issueId: issue.id, status: newStatus });
    setIsUpdating(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      setCurrentStatus(newStatus);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteIssue(issue.id);
    setIsDeleting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Issue deleted successfully');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {issue.image_url && (
          <div className="md:w-48 h-32 flex-shrink-0">
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-semibold">{issue.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={categoryColors[issue.category]} variant="secondary">
                  {issue.category}
                </Badge>
                <Badge className={statusColors[currentStatus]} variant="secondary">
                  {statusLabels[currentStatus]}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2">{issue.description}</p>

          {issue.location_name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{issue.location_name}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
            </span>

            <div className="flex gap-2 flex-wrap">
              {currentStatus !== 'open' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('open')}
                  disabled={isUpdating || isDeleting}
                >
                  Mark Open
                </Button>
              )}
              {currentStatus !== 'in_progress' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('in_progress')}
                  disabled={isUpdating || isDeleting}
                >
                  In Progress
                </Button>
              )}
              {currentStatus !== 'resolved' && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleStatusUpdate('resolved')}
                  disabled={isUpdating || isDeleting}
                >
                  Resolve
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
