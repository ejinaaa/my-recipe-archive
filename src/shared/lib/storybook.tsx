import { Suspense, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Storybook용 QueryClient 생성
 * retry: false, staleTime: Infinity로 설정하여
 * 캐시 데이터를 그대로 사용하고 refetch를 방지
 */
export const createStoryQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

/**
 * Storybook용 QueryClientProvider decorator
 *
 * @param populateCache - QueryClient 캐시를 미리 채우는 콜백
 *   성공 케이스: queryClient.setQueryData(key, data) 호출
 *   에러 케이스: 콜백 없이 사용 (fetch 실패 → ErrorBoundary 작동)
 */
export function withQueryClient(
  populateCache?: (queryClient: QueryClient) => void,
) {
  return function QueryClientDecorator({ children }: { children: ReactNode }) {
    const queryClient = createStoryQueryClient();
    populateCache?.(queryClient);

    return (
      <QueryClientProvider client={queryClient}>
        <Suspense>{children}</Suspense>
      </QueryClientProvider>
    );
  };
}
