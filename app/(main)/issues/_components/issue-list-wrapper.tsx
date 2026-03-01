'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IssueFilters } from './issue-filters';

export function IssueListWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedStatus = searchParams.get('status') || 'all';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/issues?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/issues?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <IssueFilters
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onCategoryChangeAction={handleCategoryChange}
        onStatusChangeAction={handleStatusChange}
      />
      {children}
    </div>
  );
}
