// Next.js에 적합한 캐싱 전략 세트 (HTML, CSS, JS, 이미지, 폰트 등의 캐싱 규칙 포함)
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

// __SW_MANIFEST: 빌드 시 Serwist가 자동으로 앱의 모든 정적 파일 목록을 주입하는 변수
// 직접 작성하는 값이 아니라, 빌드 결과물에서 채워짐
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// Service Worker에서는 window 대신 self를 전역 객체로 사용
declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  // 빌드된 정적 파일(JS, CSS, 폰트 등)을 SW 설치 시점에 미리 캐시
  // → 사용자가 방문하지 않아도 UI 껍데기는 오프라인에서 표시 가능
  precacheEntries: self.__SW_MANIFEST,
  // 새 SW 버전 배포 시 기존 탭이 닫힐 때까지 대기하지 않고 즉시 활성화
  skipWaiting: true,
  // skipWaiting과 세트 — 새 SW 활성화 시 현재 열린 모든 탭을 즉시 제어
  clientsClaim: true,
  // 페이지 이동 시 SW가 캐시를 확인하는 동안 서버 요청도 동시에 보내는 최적화
  navigationPreload: true,
  // 런타임 캐싱 전략 (사용자의 실제 요청에 적용)
  // - HTML: NetworkFirst (서버 응답 우선, 실패 시 캐시)
  // - CSS/JS: StaleWhileRevalidate (캐시 먼저 보여주고, 백그라운드에서 서버 업데이트)
  // - 이미지: CacheFirst (캐시 우선, 없을 때만 서버 요청)
  runtimeCaching: defaultCache,
});

// SW 생명주기 이벤트(install, activate, fetch)에 위 설정을 연결
serwist.addEventListeners();
