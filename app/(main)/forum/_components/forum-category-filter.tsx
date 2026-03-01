'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { value: 'all', label: 'All Posts' },
  { value: 'tips', label: 'Tips' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'general', label: 'General' },
];

export function ForumCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/forum?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          onClick={() => handleCategoryChange(cat.value)}
          variant={currentCategory === cat.value ? 'default' : 'outline'}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
