import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center px-4'>
      <Home className='size-12 text-text-secondary mb-4' />
      <h2 className='text-heading-3 text-text-primary mb-2'>
        앗, 여기엔 아무것도 없어요
      </h2>
      <p className='text-body-2 text-text-secondary text-center mb-6'>
        찾으시는 페이지가 사라졌거나 주소가 바뀌었어요
      </p>
      <Button asChild>
        <Link href={ROUTES.HOME}>홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
