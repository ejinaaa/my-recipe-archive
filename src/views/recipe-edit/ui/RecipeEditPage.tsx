'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import {
  useSuspenseRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from '@/entities/recipe/api/hooks';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import type {
  RecipeCategory,
  RecipeUpdate,
} from '@/entities/recipe/model/types';
import {
  RecipeCreateForm,
  convertRecipeToFormData,
  type RecipeFormData,
} from '@/features/recipe-create';
import { PageHeader } from '@/shared/ui/page-header';
import { ErrorFallback } from '@/shared/ui/error-fallback';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';
import { Skeleton } from '@/shared/ui/skeleton';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { DeleteRecipeConfirm } from './DeleteRecipeConfirm';

/**
 * 폼 영역 스켈레톤 (내부 Suspense용, header 제외)
 */
function FormSkeleton() {
  return (
    <main className='px-4 pt-6 flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-2'>
        <Skeleton className='size-24 rounded-full' />
        <Skeleton className='h-3 w-32' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-12 w-full rounded-xl' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-24 w-full rounded-xl' />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className='flex flex-col gap-3'>
          <Skeleton className='h-4 w-24' />
          <div className='flex flex-wrap gap-2'>
            {[1, 2, 3, 4, 5].map(j => (
              <Skeleton key={j} className='h-8 w-16 rounded-full' />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

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
      <main className='px-4 pt-6 pb-6'>
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
      </main>

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

    // categories 객체(타입별 배열)를 flat 배열로 변환
    const categoryArray = Object.values(formData.categories)
      .flat()
      .filter((cat): cat is RecipeCategory => cat !== undefined);

    const updateData: RecipeUpdate = {
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
      await updateRecipe.mutateAsync({ id, data: updateData });
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
    <div className='min-h-screen pb-20 bg-background'>
      {/* Header */}
      <PageHeader>
        <div className='relative flex items-center justify-center'>
          <Button
            variant='solid'
            colorScheme='neutral'
            size='sm'
            className='absolute left-0 size-10 p-0'
            onClick={handleBack}
            aria-label='뒤로가기'
          >
            <ChevronLeft className='size-5' />
          </Button>
          <h1 className='text-heading-2 text-text-primary'>
            레시피를 다듬어볼까요?
          </h1>
        </div>
      </PageHeader>

      {/* Content */}
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
