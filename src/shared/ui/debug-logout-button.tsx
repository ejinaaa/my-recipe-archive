'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/shared/api/supabase/client';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';

export function DebugLogoutButton() {
  const pathname = usePathname();
  const router = useRouter();

  // 로그인 페이지에서는 버튼을 숨김
  if (pathname === ROUTES.AUTH.LOGIN) {
    return null;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(ROUTES.AUTH.LOGIN);
    router.refresh();
  };

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <Button
        onClick={handleLogout}
        variant='solid'
        colorScheme='neutral'
        size='sm'
      >
        로그아웃 (테스트)
      </Button>
    </div>
  );
}
