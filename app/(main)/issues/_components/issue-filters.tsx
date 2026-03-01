'use client';

import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'water', label: 'Water' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'waste', label: 'Waste' },
  { value: 'other', label: 'Other' },
] as const;

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
] as const;

type IssueFiltersProps = {
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChangeAction: (category: string) => void;
  onStatusChangeAction: (status: string) => void;
};

export function IssueFilters({
  selectedCategory,
  selectedStatus,
  onCategoryChangeAction,
  onStatusChangeAction,
}: IssueFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onCategoryChangeAction(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatus === status.value ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onStatusChangeAction(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
