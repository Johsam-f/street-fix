'use client';

import { Card } from '@/components/ui/card';
import { MapIssue } from './actions';

type MapStatsProps = {
  issues: MapIssue[];
};

export function MapStats({ issues }: MapStatsProps) {
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    inProgress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length,
    water: issues.filter((i) => i.category === 'water').length,
    sanitation: issues.filter((i) => i.category === 'sanitation').length,
    waste: issues.filter((i) => i.category === 'waste').length,
    other: issues.filter((i) => i.category === 'other').length,
  };

  return (
    <Card className="absolute top-1 right-1 z-[1000] p-4 bg-background/95 backdrop-blur max-w-xs">
      <h3 className="text-sm font-semibold mb-3">Statistics</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">By Status</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-red-500">{stats.open}</div>
              <div className="text-muted-foreground">Open</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-500">{stats.inProgress}</div>
              <div className="text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-500">{stats.resolved}</div>
              <div className="text-muted-foreground">Resolved</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground mb-1">By Category</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Water:</span>
              <span className="font-semibold">{stats.water}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sanitation:</span>
              <span className="font-semibold">{stats.sanitation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Waste:</span>
              <span className="font-semibold">{stats.waste}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Other:</span>
              <span className="font-semibold">{stats.other}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
