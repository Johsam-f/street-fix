import { Suspense } from 'react';
import { ShoutoutForm } from './_components/shoutout-form';
import { ShoutoutList } from './_components/shoutout-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export const dynamic = 'force-dynamic';

export default function ShoutoutsPage() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Neighbor Shoutouts</h1>
          <p className="text-muted-foreground mt-2">
            Thank helpful neighbors and celebrate community spirit
          </p>
        </div>

        <ShoutoutForm />

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Shoutouts</h2>
          <Suspense
            fallback={
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <p>Loading shoutouts...</p>
              </div>
            }
          >
            <ShoutoutList />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  );
}
