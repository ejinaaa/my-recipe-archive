'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ErrorFallbackProps {
  title?: string;
  description?: string;
  onBack?: () => void;
  onRetry?: () => void;
  /** react-error-boundary FallbackComponent 호환 */
  error?: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({
  title = '이런, 뭔가 잘못됐어요',
  description = '일시적인 문제예요. 다시 시도해주세요',
  onBack,
  onRetry,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const handleRetry = onRetry ?? resetErrorBoundary;

  return (
    <div className='flex flex-col items-center justify-center py-20 px-4'>
      <AlertCircle className='size-12 text-text-secondary mb-4' />
      <p className='text-heading-3 text-text-primary mb-2'>{title}</p>
      <p className='text-body-2 text-text-secondary text-center mb-6'>
        {description}
      </p>
      <div className='flex gap-2'>
        {onBack && (
          <Button variant='solid' colorScheme='neutral' onClick={onBack}>
            뒤로가기
          </Button>
        )}
        {handleRetry && <Button onClick={handleRetry}>다시 시도</Button>}
      </div>
    </div>
  );
}
