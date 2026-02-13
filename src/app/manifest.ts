import type { MetadataRoute } from 'next';
import { ROUTES } from '@/shared/config/routes';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // 앱의 고유 식별자 — URL이 바뀌어도 브라우저가 "같은 앱"으로 인식하는 기준
    id: 'my-recipe-archive',
    // 앱 설치 팝업, 스플래시 스크린에 표시되는 전체 이름
    name: 'My Recipe Archive',
    // 홈 화면 아이콘 아래에 표시되는 짧은 이름 (공간 부족 시 name 대신 사용)
    short_name: '마레아',
    // 앱 설명 (브라우저 앱 정보 등에서 노출)
    description: '나만의 맛있는 요리 레시피를 기록하고 관리하세요',
    // 앱의 언어
    lang: 'ko',
    // 홈 화면에서 앱 아이콘 탭 시 처음 열리는 URL
    start_url: ROUTES.HOME,
    // PWA가 제어하는 URL 범위 — 이 범위 밖의 링크는 일반 브라우저에서 열림
    scope: '/',
    // 앱 표시 모드 — standalone: 주소창 없이 네이티브 앱처럼 표시
    display: 'standalone',
    // 스플래시 스크린(앱 로딩 화면) 배경색
    background_color: '#FFFFFF',
    // 모바일 상태바(주소창 영역) 색상 — primary-base
    theme_color: '#FF8762',
    // 화면 방향 고정 — portrait-primary: 세로 모드
    orientation: 'portrait-primary',
    // PWA 아이콘 — 192x192(홈 화면), 512x512(스플래시/고해상도) 최소 필요
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    // 홈 화면 아이콘 길게 누르면 나오는 빠른 실행 메뉴
    shortcuts: [
      {
        name: '새 레시피 작성',
        short_name: '새 레시피',
        url: ROUTES.RECIPES.NEW,
        icons: [{ src: '/icons/add-icon-192.png', sizes: '192x192' }],
      },
      {
        name: '레시피 검색',
        short_name: '검색',
        url: ROUTES.SEARCH,
        icons: [{ src: '/icons/search-icon-192.png', sizes: '192x192' }],
      },
      {
        name: '즐겨찾기',
        url: ROUTES.FAVORITES,
        icons: [{ src: '/icons/favorite-icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
