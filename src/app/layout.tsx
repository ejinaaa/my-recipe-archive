import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryProvider } from '@/shared/providers/query-provider';
import { DebugLogoutButton } from '@/shared/ui/debug-logout-button';
import { Toaster } from '@/shared/ui/sonner';
import './globals.css';

const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

// 뷰포트 설정 — Next.js에서 <meta name="viewport"> 태그를 생성
export const viewport: Viewport = {
  // 모바일 브라우저에서 콘텐츠를 화면 너비에 맞춤 (반응형 필수 설정)
  width: 'device-width',
  // 초기 확대 비율 1:1 (100%)
  initialScale: 1,
  // PWA standalone 모드에서 핀치 줌 방지 (네이티브 앱 느낌)
  maximumScale: 1,
  // 사용자 확대/축소 비활성화 (네이티브 앱처럼)
  userScalable: false,
  // 브라우저 주소창/상태바 색상 — primary-base (#FFB299)
  // manifest.ts의 theme_color와 동일하게 맞춤
  themeColor: '#FFB299',
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'My Recipe Archive',
  description: '나만의 맛있는 요리 레시피를 기록하고 관리하세요',
  // 브라우저 탭 아이콘 + iOS 홈 화면 아이콘 설정
  icons: {
    // 브라우저 탭에 표시되는 아이콘 (favicon 역할)
    icon: '/icons/icon-192.png',
    // iOS "홈 화면에 추가" 시 사용되는 아이콘
    // 이 설정이 없으면 iOS가 페이지 스크린샷을 아이콘으로 사용
    apple: '/icons/icon-192.png',
  },
  // SNS 공유 시 미리보기 카드에 표시되는 정보 (카카오톡, 슬랙 등)
  openGraph: {
    title: 'My Recipe Archive',
    description: '나만의 맛있는 요리 레시피를 기록하고 관리하세요',
    siteName: 'My Recipe Archive',
    locale: 'ko_KR',
    type: 'website',
  },
  // iOS Safari 전용 PWA 설정 (Android는 manifest.ts로 처리)
  appleWebApp: {
    // iOS "홈 화면에 추가" 시 브라우저 UI 없이 앱처럼 실행 (manifest의 display: 'standalone' 역할)
    capable: true,
    // iOS 상태바 스타일 — 'default': 검은 글씨 + 흰 배경 (밝은 테마에 적합)
    statusBarStyle: 'default',
    // iOS 홈 화면 아이콘 아래 표시되는 이름 (manifest의 short_name 역할)
    title: '마레아',
  },
};

const inter = Inter({
  variable: '--font-inter',
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              {process.env.NODE_ENV === 'development' && <DebugLogoutButton />}
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
