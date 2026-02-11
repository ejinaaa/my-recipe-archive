'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import {
  useSuspenseRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from '@/entities/recipe/api/hooks';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import {
  RecipeCreateForm,
  convertRecipeToFormData,
  convertFormDataToRecipeData,
  type RecipeFormData,
} from '@/features/recipe-create';
import { PageContent } from '@/shared/ui/page-content';
import { PageHeader } from '@/shared/ui/page-header';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { BackButton } from '@/shared/ui/back-button';
import { DeleteRecipeConfirm } from './DeleteRecipeConfirm';
import { FormSkeleton } from './FormSkeleton';

interface RecipeEditPageProps {
  id: string;
}

/**
 * 레시피 + 카테고리 데이터가 필요한 편집 폼 콘텐츠
 */
function RecipeEditContent({
  id,
  onSubmit,
  onDelete,
  isDeletePending,
  userId,
}: {
  id: string;
  onSubmit: (formData: RecipeFormData) => Promise<void>;
  onDelete: () => Promise<void>;
  isDeletePending: boolean;
  userId?: string;
}) {
  const { data: recipe } = useSuspenseRecipe(id);
  const { data: categoryGroups } = useSuspenseCategoryGroups();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!recipe) {
    return null;
  }

  const initialData = convertRecipeToFormData(recipe);

  return (
    <>
      {/* Form */}
      <div className='px-4 pt-6 pb-6'>
        <RecipeCreateForm
          categoryGroups={categoryGroups}
          onSubmit={onSubmit}
          mode='edit'
          initialData={initialData}
          userId={userId}
        />

        {/* 삭제 버튼 */}
        <Button
          variant='ghost'
          colorScheme='neutral'
          size='lg'
          onClick={() => setDeleteOpen(true)}
          className='w-full mt-3 text-destructive'
        >
          이 레시피를 삭제할게요
        </Button>
      </div>

      {/* 삭제 확인 Bottom Sheet */}
      <DeleteRecipeConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        isPending={isDeletePending}
      />
    </>
  );
}

export function RecipeEditPage({ id }: RecipeEditPageProps) {
  const router = useRouter();
  const { data: profile } = useCurrentProfile();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();
  const [mutationError, setMutationError] = useState<{
    retry: () => void;
    title: string;
    description: string;
  } | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe.mutateAsync(id);
      router.back();
    } catch {
      setMutationError({
        retry: () => handleDelete(),
        title: '레시피를 삭제하지 못했어요',
        description: '잠시 후 다시 시도해주세요',
      });
    }
  };

  const handleSubmit = async (formData: RecipeFormData) => {
    if (!profile?.id) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    try {
      await updateRecipe.mutateAsync({
        id,
        data: convertFormDataToRecipeData(formData),
      });
      router.replace(ROUTES.RECIPES.DETAIL(id));
    } catch {
      setMutationError({
        retry: () => handleSubmit(formData),
        title: '레시피를 수정하지 못했어요',
        description: '수정한 내용은 유지돼요. 다시 시도해주세요',
      });
    }
  };

  return (
    <div className='h-dvh flex flex-col bg-background'>
      {/* Header */}
      <PageHeader>
        <BackButton onBack={handleBack} />
        <h1 className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-heading-2 text-text-primary'>
          레시피를 다듬어볼까요?
        </h1>
      </PageHeader>

      {/* Content */}
      <PageContent>
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ErrorFallback
              onRetry={resetErrorBoundary}
              onBack={() => router.push(ROUTES.RECIPES.LIST)}
              title='필요한 정보를 가져오지 못했어요'
              description='레시피 수정에 필요한 데이터를 준비하지 못했어요'
            />
          )}
        >
          <Suspense fallback={<FormSkeleton />}>
            <RecipeEditContent
              id={id}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              isDeletePending={deleteRecipe.isPending}
              userId={profile?.id}
            />
          </Suspense>
        </ErrorBoundary>
      </PageContent>

      <BottomNavigation activeTab='register' />

      {/* Mutation 에러 Bottom Sheet */}
      <ErrorBottomSheet
        open={!!mutationError}
        onOpenChange={open => !open && setMutationError(null)}
        onRetry={() => {
          mutationError?.retry();
          setMutationError(null);
        }}
        onCancel={() => setMutationError(null)}
        title={mutationError?.title}
        description={mutationError?.description}
      />
    </div>
  );
}
