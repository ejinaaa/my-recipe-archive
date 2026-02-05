import { Button } from '@/shared/ui/button';

interface RecipeListErrorProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function RecipeListError({
  error,
  resetErrorBoundary,
}: RecipeListErrorProps) {
  return (
    <div className='flex flex-col items-center justify-center py-20 px-4'>
      <p className='text-heading-3 text-text-primary mb-2'>
        앗, 문제가 생겼어요
      </p>
      <p className='text-body-2 text-text-secondary text-center mb-6'>
        {error?.message || '잠시 후 다시 시도해 주세요'}
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} variant='outline'>
          다시 시도하기
        </Button>
      )}
    </div>
  );
}
