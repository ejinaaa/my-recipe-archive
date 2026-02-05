import { createClient } from '@/shared/api/supabase/server';
import { ROUTES } from '@/shared/config';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? ROUTES.RECIPES.LIST;

  if (code) {
    const supabase = await createClient();

    // OAuth 코드를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 현재 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 프로필 존재 여부 확인
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // 프로필이 없으면 자동 생성
        if (!existingProfile) {
          const nickname =
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            '사용자';

          await supabase.from('profiles').insert({
            id: user.id,
            nickname,
            image_url: user.user_metadata?.avatar_url || null,
          });
        }
      }

      // 성공 시 next 파라미터로 지정된 경로로 리다이렉트
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`http://localhost:3000${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${request.nextUrl.origin}${next}`);
      }
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${request.nextUrl.origin}${ROUTES.AUTH.LOGIN}`);
}
