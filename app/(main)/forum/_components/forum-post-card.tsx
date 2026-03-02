import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: 'tips' | 'emergency' | 'general';
  created_at: string;
  user_id: string;
  reply_count?: number;
};

type ForumPostCardProps = {
  post: ForumPost;
};

const categoryColors = {
  tips: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  emergency: 'bg-red-500/10 text-red-700 dark:text-red-400',
  general: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
};

const categoryLabels = {
  tips: 'Tips',
  emergency: 'Emergency',
  general: 'General',
};

export function ForumPostCard({ post }: ForumPostCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{post.title}</h3>
          </div>
          <Badge className={categoryColors[post.category]} variant="secondary">
            {categoryLabels[post.category]}
          </Badge>
        </div>

        <p className="text-muted-foreground line-clamp-3 break-words">{post.content}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <span>
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
          {typeof post.reply_count !== 'undefined' && (
            <span>
              {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
