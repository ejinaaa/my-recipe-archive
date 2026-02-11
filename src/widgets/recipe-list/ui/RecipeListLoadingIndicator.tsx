import { Loader2 } from 'lucide-react';

export function RecipeListLoadingIndicator() {
  return (
    <div className='flex items-center justify-center py-8'>
      <Loader2 className='size-6 animate-spin text-text-secondary' />
      <span className='ml-2 text-body-2 text-text-secondary'>
        불러오는 중...
      </span>
    </div>
  );
}
