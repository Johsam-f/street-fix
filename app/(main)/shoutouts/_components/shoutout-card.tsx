import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Shoutout = {
  id: string;
  from_user_id: string;
  to_user_name: string;
  message: string;
  created_at: string;
};

type ShoutoutCardProps = {
  shoutout: Shoutout;
};

export function ShoutoutCard({ shoutout }: ShoutoutCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow bg-gradient-to-br from-background to-pink-50/20 dark:to-pink-950/10">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg">
              To <span className="text-primary">{shoutout.to_user_name}</span>
            </p>
          </div>
        </div>

        <p className="text-muted-foreground ml-9 italic">
          "{shoutout.message}"
        </p>

        <div className="text-sm text-muted-foreground ml-9 pt-2 border-t">
          <span>
            {formatDistanceToNow(new Date(shoutout.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Card>
  );
}
