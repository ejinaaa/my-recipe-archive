'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { ROUTES } from '@/shared/config';
import { useCurrentProfileQuery } from '@/entities/user/api/hooks';
import { useCreateRecipeMutation } from '@/entities/recipe/api/hooks';
import { useSuspenseCategoryGroupsQuery } from '@/entities/category/api/hooks';
import {
  RecipeCreateForm,
  convertFormDataToRecipeData,
  type RecipeFormData,
} from '@/features/recipe-create';
import { PageContent } from '@/shared/ui/page-content';
import { PageHeader } from '@/shared/ui/page-header';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { FormSkeleton } from './FormSkeleton';

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
  const { data: categoryGroups } = useSuspenseCategoryGroupsQuery();

  return (
    <div className='px-5 pt-6 pb-8'>
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
  const { data: profile } = useCurrentProfileQuery();
  const createRecipe = useCreateRecipeMutation();
  const [mutationError, setMutationError] = useState<{
    retry: () => void;
  } | null>(null);

  const handleSubmit = async (formData: RecipeFormData) => {
    if (!profile?.id) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    try {
      const newRecipe = await createRecipe.mutateAsync({
        user_id: profile.id,
        ...convertFormDataToRecipeData(formData),
      });
      router.replace(ROUTES.RECIPES.DETAIL(newRecipe.id));
    } catch {
      setMutationError({ retry: () => handleSubmit(formData) });
    }
  };

  return (
    <div className='h-dvh flex flex-col bg-background'>
      <PageHeader className='justify-center'>
        <h1 className='text-heading-2 text-text-primary text-center'>
          오늘은 어떤 요리를 기록할까요?
        </h1>
      </PageHeader>

      <PageContent>
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback
              onRetry={resetErrorBoundary}
              onBack={() => router.push(ROUTES.HOME)}
              title='카테고리 정보를 가져오지 못했어요'
              description='레시피 작성에 필요한 카테고리를 준비하지 못했어요'
            />
          )}
        >
          <Suspense fallback={<FormSkeleton />}>
            <RecipeCreateContent onSubmit={handleSubmit} userId={profile?.id} />
          </Suspense>
        </ErrorBoundary>
      </PageContent>

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
