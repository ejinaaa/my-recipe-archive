'use client';

import { AppLogo } from '@/shared/ui/app-logo';
import { Button } from '@/shared/ui/button';
import { KakaoIcon } from '@/shared/ui/kakao-icon';
import { createClient } from '@/shared/api/supabase/client';

export function LoginPage() {
  const handleKakaoLogin = async () => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/confirm?next=/recipes`,
        },
      });

      if (error) {
        console.error('카카오 로그인 오류:', error.message);
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('카카오 로그인 예외:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-10 px-6 pb-20 pt-10'>
      <div className='flex flex-col items-center justify-center gap-3'>
        <AppLogo />

        <h1 className='text-heading-1 text-text-primary'>
          My
          <span className='text-heading-1 text-text-primary'> Recipe </span>
          Archive
        </h1>
      </div>

      <div className='w-full max-w-md'>
        <Button
          onClick={handleKakaoLogin}
          size='lg'
          className='w-full rounded-xl bg-[#FEE500] text-[#000000] hover:bg-[#FEE500] active:bg-[#FEE500] focus-visible:ring-[#FEE500]'
        >
          <KakaoIcon size={24} className='shrink-0' />
          <span className='font-semibold' style={{ opacity: 0.85 }}>
            카카오 로그인
          </span>
        </Button>
      </div>
    </div>
  );
}
