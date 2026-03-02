import { Suspense } from 'react';
import { ForumPostForm } from './_components/forum-post-form';
import { ForumPostList } from './_components/forum-post-list';
import { ForumCategoryFilter } from './_components/forum-category-filter';
import { ScrollArea } from '@/components/ui/scroll-area';

export const dynamic = 'force-dynamic';

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  return (
    <ScrollArea className="h-full w-full">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground mt-2">
            Share tips, ask questions, and connect with neighbors
          </p>
        </div>

        <ForumPostForm />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Forum Posts</h2>
          <Suspense fallback={<div className="h-10 mb-6" />}>
            <ForumCategoryFilter />
          </Suspense>
          <Suspense
            key={params.category || 'all'}
            fallback={
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <p>Loading posts...</p>
              </div>
            }
          >
            <ForumPostList category={params.category} />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  );
}
