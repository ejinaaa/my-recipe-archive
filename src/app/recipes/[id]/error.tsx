'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-5'>
      <AlertCircle className='size-12 text-text-secondary mb-4' />
      <h2 className='text-heading-3 text-text-primary mb-2'>
        레시피를 불러올 수 없어요
      </h2>
      <p className='text-body-2 text-text-secondary text-center mb-6'>
        잠시 후 다시 시도해주세요
      </p>
      <div className='flex gap-2'>
        <Button variant='outline' onClick={() => router.back()}>
          뒤로가기
        </Button>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  );
}
