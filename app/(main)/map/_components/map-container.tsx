'use client';

import dynamic from 'next/dynamic';
import { MapIssue } from './actions';

const IssueMapComponent = dynamic(() => import('./issue-map').then(mod => ({ default: mod.IssueMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/20">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

type MapContainerProps = {
  issues: MapIssue[];
};

export function MapContainer({ issues }: MapContainerProps) {
  return <IssueMapComponent issues={issues} />;
}
