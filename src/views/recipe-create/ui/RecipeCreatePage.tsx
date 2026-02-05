'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import { useCreateRecipe } from '@/entities/recipe/api/hooks';
import type {
  RecipeInsert,
  RecipeCategory,
} from '@/entities/recipe/model/types';
import type { CategoryGroup } from '@/entities/category/model/types';
import {
  RecipeCreateForm,
  type RecipeFormData,
} from '@/features/recipe-create';
import { BottomNavigation } from '@/widgets/bottom-navigation';

interface RecipeCreatePageProps {
  categoryGroups: CategoryGroup[];
}

export function RecipeCreatePage({ categoryGroups }: RecipeCreatePageProps) {
  const router = useRouter();
  const { data: profile } = useCurrentProfile();
  const createRecipe = useCreateRecipe();

  const handleBack = () => {
    router.back();
  };

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
      <header className='sticky top-0 z-10 bg-background px-4 pt-4 pb-3'>
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
            나만의 레시피 만들기
          </h1>
        </div>
      </header>

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
