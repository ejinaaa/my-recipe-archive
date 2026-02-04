import { createClient } from '@/shared/api/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/recipes';

  if (code) {
    const supabase = await createClient();

    // OAuth 코드를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
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
  return NextResponse.redirect(`${request.nextUrl.origin}/login`);
}
