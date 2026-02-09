'use client';

import { useRouter } from 'next/navigation';
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
import { BottomNavigation } from '@/widgets/bottom-navigation';

export function RecipeCreatePage() {
  const router = useRouter();
  const { data: profile } = useCurrentProfile();
  const { data: categoryGroups } = useSuspenseCategoryGroups();
  const createRecipe = useCreateRecipe();

  const handleSubmit = async (formData: RecipeFormData) => {
    if (!profile?.id) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    // categories 객체를 배열로 변환
    const categoryArray = Object.values(formData.categories).filter(
      (cat): cat is RecipeCategory => cat !== undefined,
    );

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
      // 에러는 useCreateRecipe의 onError에서 처리
    }
  };

  return (
    <div className='min-h-screen pb-20 bg-background'>
      {/* Header */}
      <PageHeader>
        <h1 className='text-heading-2 text-text-primary text-center'>
          오늘은 어떤 요리를 기록할까요?
        </h1>
      </PageHeader>

      {/* Form */}
      <main className='px-4 pt-6'>
        <RecipeCreateForm
          categoryGroups={categoryGroups}
          onSubmit={handleSubmit}
        />
      </main>

      <BottomNavigation activeTab='register' />
    </div>
  );
}
