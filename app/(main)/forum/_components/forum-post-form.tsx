'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { createPost } from './actions';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'tips', label: 'Tips' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'general', label: 'General' },
] as const;

export function ForumPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'tips' | 'emergency' | 'general'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Card className="p-6">
      <form
        action={async (formData: FormData) => {
          const title = formData.get('title') as string;
          const content = formData.get('content') as string;
          const category = formData.get('category') as 'tips' | 'emergency' | 'general';

          if (!title || title.length < 5) {
            toast.error('Title must be at least 5 characters');
            return;
          }

          if (!content || content.length < 10) {
            toast.error('Content must be at least 10 characters');
            return;
          }

          setIsSubmitting(true);

          const result = await createPost({ title, content, category });

          setIsSubmitting(false);

          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success('Post created successfully!');
            setTitle('');
            setContent('');
            setCategory('general');
          }
        }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={5}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            name="content"
            placeholder="Share your thoughts, tips, or ask questions..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
            disabled={isSubmitting}
            rows={6}
            className="w-full px-3 py-2 border rounded-md resize-vertical min-h-[100px] bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as 'tips' | 'emergency' | 'general')}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </Card>
  );
}
