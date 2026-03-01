'use client';

import { Card } from '@/components/ui/card';

const CATEGORIES = [
  { value: 'water', label: 'Water', color: '#3b82f6' },
  { value: 'sanitation', label: 'Sanitation', color: '#a855f7' },
  { value: 'waste', label: 'Waste', color: '#22c55e' },
  { value: 'other', label: 'Other', color: '#6b7280' },
] as const;

export function MapLegend() {
  return (
    <Card className="absolute bottom-1 left-1 z-[1000] p-4 bg-background/95 backdrop-blur">
      <h3 className="text-sm font-semibold mb-2">Categories</h3>
      <div className="space-y-2">
        {CATEGORIES.map((category) => (
          <div key={category.value} className="flex items-center gap-2 text-xs">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: category.color }}
            />
            <span>{category.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
