import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Locate } from 'lucide-react';
import Image from 'next/image';

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
  user_id: string;
};

const CATEGORY_COLORS = {
  water: 'bg-blue-500',
  sanitation: 'bg-purple-500',
  waste: 'bg-green-500',
  other: 'bg-gray-500',
} as const;

const STATUS_COLORS = {
  open: 'bg-red-500',
  in_progress: 'bg-yellow-500',
  resolved: 'bg-green-500',
} as const;

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
} as const;

export function IssueCard({ issue }: { issue: Issue }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {issue.image_url && (
          <div className="w-full sm:w-48 h-48 flex-shrink-0">
            <Image
              src={issue.image_url}
              alt={issue.title}
              className="w-full h-full object-cover"
              width={200}
              height={200}
            />
          </div>
        )}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold line-clamp-2">{issue.title}</h3>
            <Badge className={STATUS_COLORS[issue.status]}>
              {STATUS_LABELS[issue.status]}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {issue.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline" className={CATEGORY_COLORS[issue.category]}>
              {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
            </Badge>
            <div className="flex items-start gap-1 text-muted-foreground">
              <Locate className="flex-shrink-0 mt-0.5" color='red' size={15}/>
              <span>
                {issue.location_name ? (
                  <>
                    <span className="text-foreground">{issue.location_name}</span>
                    <span className="text-xs block">
                      {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                    </span>
                  </>
                ) : (
                  <span>{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</span>
                )}
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {formatDate(issue.created_at)}
          </div>
        </div>
      </div>
    </Card>
  );
}
