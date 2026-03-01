import { Suspense } from 'react';
import { MapWrapper } from './_components/map-wrapper';

export const dynamic = 'force-dynamic';

export default function MapPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">Community Map</h1>
        <p className="text-muted-foreground mt-2">
          View all reported issues on the map
        </p>
      </div>

      <div className="flex-1 relative">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          }
        >
          <MapWrapper />
        </Suspense>
      </div>
    </div>
  );
}
