'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang='ko'>
      <body className='antialiased'>
        <div className='min-h-screen bg-background flex flex-col items-center justify-center px-5'>
          <AlertCircle className='size-12 text-text-secondary mb-4' />
          <h2 className='text-heading-3 text-text-primary mb-2'>
            이런, 뭔가 잘못됐어요
          </h2>
          <p className='text-body-2 text-text-secondary text-center mb-6'>
            일시적인 문제예요. 다시 시도해주세요
          </p>
          <Button onClick={reset}>다시 시도</Button>
        </div>
      </body>
    </html>
  );
}
