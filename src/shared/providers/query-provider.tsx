'use client';

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/shared/api/fetchWithError';

/**
 * React Query Provider for the application
 * Wraps the app with QueryClientProvider and includes devtools in development
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // 비치명적 에러 무시
            if (mutation.meta?.suppressErrorToast) return;
            // 페이지에서 직접 bottom sheet 처리
            if (mutation.meta?.handleErrorManually) return;

            // 권한/데이터 없음 → 3초 toast
            if (
              error instanceof ApiError &&
              (error.status === 403 || error.status === 404)
            ) {
              const msg =
                error.status === 403
                  ? '권한이 없어 처리하지 못했어요'
                  : '해당 데이터가 이미 삭제되었거나 존재하지 않아요';
              toast.error(msg, { duration: 3000 });
              return;
            }

            // 나머지 → 일반 toast
            toast.error(
              error.message || '요청을 처리하지 못했어요. 다시 시도해주세요'
            );
          },
        }),
        defaultOptions: {
          queries: {
            // Stale time: 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache time: 10 minutes
            gcTime: 10 * 60 * 1000,
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Retry failed requests once
            retry: 1,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
