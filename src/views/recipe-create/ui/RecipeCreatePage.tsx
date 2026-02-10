'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { ROUTES } from '@/shared/config';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import { useCreateRecipe } from '@/entities/recipe/api/hooks';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import type {
  RecipeInsert,
  RecipeCategory,
} from '@/entities/recipe/model/types';
import {
  RecipeCreateForm,
  type RecipeFormData,
} from '@/features/recipe-create';
import { PageHeader } from '@/shared/ui/page-header';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';
import { Skeleton } from '@/shared/ui/skeleton';
import { BottomNavigation } from '@/widgets/bottom-navigation';

/**
 * 폼 영역 스켈레톤
 */
function FormSkeleton() {
  return (
    <div className='px-4 pt-6 space-y-6'>
      <Skeleton className='h-10 w-full rounded-lg' />
      <Skeleton className='h-24 w-full rounded-lg' />
      <Skeleton className='h-10 w-full rounded-lg' />
      <Skeleton className='h-10 w-full rounded-lg' />
      <div className='space-y-3'>
        <Skeleton className='h-5 w-24 rounded-md' />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-16 rounded-full' />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 카테고리 데이터가 필요한 폼 콘텐츠
 */
function RecipeCreateContent({
  onSubmit,
  userId,
}: {
  onSubmit: (formData: RecipeFormData) => Promise<void>;
  userId?: string;
}) {
  const { data: categoryGroups } = useSuspenseCategoryGroups();

  return (
    <div className='px-4 pt-6 pb-8'>
      <RecipeCreateForm
        categoryGroups={categoryGroups}
        onSubmit={onSubmit}
        userId={userId}
      />
    </div>
  );
}

export function RecipeCreatePage() {
  const router = useRouter();
  const { data: profile } = useCurrentProfile();
  const createRecipe = useCreateRecipe();
  const [mutationError, setMutationError] = useState<{
    retry: () => void;
  } | null>(null);

  const handleSubmit = async (formData: RecipeFormData) => {
    if (!profile?.id) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    // categories 객체(타입별 배열)를 flat 배열로 변환
    const categoryArray = Object.values(formData.categories)
      .flat()
      .filter((cat): cat is RecipeCategory => cat !== undefined);

    const insertData: RecipeInsert = {
      user_id: profile.id,
      title: formData.title,
      description: formData.description || undefined,
      thumbnail_url: formData.thumbnail_url || undefined,
      cooking_time: formData.cooking_time,
      servings: formData.servings,
      categories: categoryArray,
      ingredients: formData.ingredients,
      steps: formData.steps,
    };

    try {
      const newRecipe = await createRecipe.mutateAsync(insertData);
      router.replace(ROUTES.RECIPES.DETAIL(newRecipe.id));
    } catch {
      setMutationError({ retry: () => handleSubmit(formData) });
    }
  };

  return (
    <div className='h-dvh flex flex-col bg-background'>
      <PageHeader>
        <h1 className='text-heading-2 text-text-primary text-center'>
          오늘은 어떤 요리를 기록할까요?
        </h1>
      </PageHeader>

      <main className='flex-1 overflow-y-auto'>
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback
              onRetry={resetErrorBoundary}
              onBack={() => router.push(ROUTES.RECIPES.LIST)}
              title='카테고리 정보를 가져오지 못했어요'
              description='레시피 작성에 필요한 카테고리를 준비하지 못했어요'
            />
          )}
        >
          <Suspense fallback={<FormSkeleton />}>
            <RecipeCreateContent onSubmit={handleSubmit} userId={profile?.id} />
          </Suspense>
        </ErrorBoundary>
      </main>

      <BottomNavigation activeTab='register' />

      <ErrorBottomSheet
        open={!!mutationError}
        onOpenChange={open => !open && setMutationError(null)}
        onRetry={() => {
          mutationError?.retry();
          setMutationError(null);
        }}
        onCancel={() => setMutationError(null)}
        title='레시피를 저장하지 못했어요'
        description='작성한 내용은 유지돼요. 다시 시도해주세요'
      />
    </div>
  );
}
