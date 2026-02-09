import { QueryClient } from '@tanstack/react-query';

/** 서버 사이드 prefetch용 QueryClient 생성 */
export const createServerQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  });

export { dehydrate, HydrationBoundary } from '@tanstack/react-query';
