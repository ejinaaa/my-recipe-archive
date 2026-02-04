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
        레시피를 불러올 수 없습니다
      </p>
      <p className='text-body-2 text-text-secondary text-center mb-6'>
        {error?.message ||
          '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
      </p>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} variant='outline'>
          다시 시도
        </Button>
      )}
    </div>
  );
}
