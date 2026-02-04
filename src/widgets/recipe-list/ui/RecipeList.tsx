'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { RecipeCard } from '@/entities/recipe/ui/RecipeCard';
import type { Recipe } from '@/entities/recipe/model/types';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

interface RecipeListProps {
  recipes: Recipe[];
  searchQuery: string;
}

export function RecipeList({ recipes, searchQuery }: RecipeListProps) {
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;

    const query = searchQuery.toLowerCase();
    return recipes.filter(
      recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query)
    );
  }, [recipes, searchQuery]);

  // Get currently displayed recipes
  const displayedRecipes = useMemo(() => {
    return filteredRecipes.slice(0, displayedCount);
  }, [filteredRecipes, displayedCount]);

  const hasMore = displayedCount < filteredRecipes.length;

  // Load more recipes
  const loadMore = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount(prev =>
        Math.min(prev + ITEMS_PER_PAGE, filteredRecipes.length)
      );
      setIsLoading(false);
    }, 500);
  };

  // Reset displayed count when search query changes
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, displayedCount, filteredRecipes.length]);

  return (
    <div className='pb-4'>
      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 px-3'>
          <p className='text-body-1 text-text-secondary text-center'>
            검색 결과가 없습니다
          </p>
        </div>
      )}

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 && (
        <div className='grid grid-cols-2 gap-2 px-3'>
          {displayedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className='w-full max-w-none'
            />
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='size-6 animate-spin text-text-secondary' />
          <span className='ml-2 text-body-2 text-text-secondary'>
            로딩 중...
          </span>
        </div>
      )}

      {/* Intersection Observer Target */}
      {hasMore && !isLoading && <div ref={observerTarget} className='h-4' />}

      {/* End Message */}
      {!hasMore && displayedRecipes.length > 0 && (
        <div className='flex items-center justify-center py-8'>
          <p className='text-body-2 text-text-secondary'>
            모든 레시피를 불러왔습니다
          </p>
        </div>
      )}
    </div>
  );
}
