import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES } from '@/shared/config';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 사용자가 로그인 페이지가 아닌 곳에 접근하면 로그인 페이지로 리다이렉트
  if (
    !user &&
    !request.nextUrl.pathname.startsWith(ROUTES.AUTH.LOGIN) &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.AUTH.LOGIN;
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 로그인 페이지에 접근하면 /recipes로 리다이렉트
  if (user && request.nextUrl.pathname === ROUTES.AUTH.LOGIN) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.RECIPES.LIST;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
