'use client';

import { Button } from '@/shared/ui/button';
import { KakaoIcon } from '@/shared/ui/kakao-icon';
import { createClient } from '@/shared/api/supabase/client';
import { ROUTES } from '@/shared/config/routes';

export function KakaoLoginButton() {
  const handleKakaoLogin = async () => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}${ROUTES.AUTH.CONFIRM}?next=${ROUTES.HOME}`,
        },
      });

      if (error) {
        console.error('카카오 로그인 오류:', error.message);
        alert('로그인에 실패했어요. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('카카오 로그인 예외:', error);
      alert('로그인에 실패했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <Button
      onClick={handleKakaoLogin}
      size='lg'
      className='w-full rounded-xl bg-[#FEE500] text-[#000000] hover:bg-[#FEE500] active:bg-[#FEE500] focus-visible:ring-[#FEE500]'
    >
      <KakaoIcon size={24} className='shrink-0' />
      <span className='font-semibold' style={{ opacity: 0.85 }}>
        카카오로 시작하기
      </span>
    </Button>
  );
}
