'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseCategoryGroupsQuery } from '@/entities/category/api/hooks';
import { CATEGORY_TYPES } from '@/entities/category/model/constants';
import type { CategoryType } from '@/entities/category/model/types';
import { getOptionsByType } from '@/entities/category/model/utils';
import { formatCookingTime } from '@/entities/recipe/model/utils';
import type { RecipeSortBy } from '@/entities/recipe/model/types';
import { Badge } from '@/shared/ui/badge';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { Skeleton } from '@/shared/ui/skeleton';
import type { CategoryFilters, CookingTimeRange } from '../model/types';
import { SORT_OPTIONS } from '../model/constants';
import { isDefaultCookingTimeRange } from '../model/utils';

interface ActiveFilterBadgesProps {
  /** 현재 적용된 정렬 */
  sortBy: RecipeSortBy | null;
  /** 현재 적용된 카테고리 필터 */
  categoryFilters: CategoryFilters;
  /** 현재 적용된 조리시간 범위 */
  cookingTimeRange: CookingTimeRange | null;
  /** 정렬 제거 핸들러 */
  onRemoveSort: () => void;
  /** 개별 카테고리 필터 제거 핸들러 */
  onRemoveCategoryFilter: (type: CategoryType, code: string) => void;
  /** 조리시간 필터 제거 핸들러 */
  onRemoveCookingTime: () => void;
}

/**
 * 현재 적용된 정렬/필터를 뱃지로 표시하는 컴포넌트
 *
 * 활성 필터가 없으면 렌더링하지 않아 쿼리도 실행되지 않음.
 * 에러 발생 시 영역 자체를 숨김.
 */
export function ActiveFilterBadges(props: ActiveFilterBadgesProps) {
  const { sortBy, categoryFilters, cookingTimeRange } = props;

  const hasCategory = CATEGORY_TYPES.some(
    type => categoryFilters[type].length > 0,
  );
  const hasCookingTime =
    cookingTimeRange !== null && !isDefaultCookingTimeRange(cookingTimeRange);

  if (!sortBy && !hasCategory && !hasCookingTime) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense
        fallback={
          <HorizontalScroll className='gap-1.5 px-5 py-2'>
            <Skeleton className='h-8 w-16 shrink-0 rounded-full' />
            <Skeleton className='h-8 w-16 shrink-0 rounded-full' />
            <Skeleton className='h-8 w-16 shrink-0 rounded-full' />
          </HorizontalScroll>
        }
      >
        <ActiveFilterBadgesContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * 뱃지 렌더링 내부 컴포넌트 (useSuspenseCategoryGroupsQuery 사용)
 *
 * 고정 순서: sort → situation → cuisine → dishType → cookingTime
 */
function ActiveFilterBadgesContent({
  sortBy,
  categoryFilters,
  cookingTimeRange,
  onRemoveSort,
  onRemoveCategoryFilter,
  onRemoveCookingTime,
}: ActiveFilterBadgesProps) {
  const { data: categoryGroups } = useSuspenseCategoryGroupsQuery();

  // 정렬 옵션 조회
  const sortOption = sortBy
    ? SORT_OPTIONS.find(opt => opt.value === sortBy)
    : null;

  // 카테고리 코드 → { icon, name } 변환
  const getCategoryInfo = (type: CategoryType, code: string) => {
    const option = getOptionsByType(categoryGroups, type).find(
      opt => opt.code === code,
    );
    return { icon: option?.icon, name: option?.name ?? code };
  };

  // 조리시간 필터 활성 여부
  const hasCookingTimeFilter =
    cookingTimeRange !== null && !isDefaultCookingTimeRange(cookingTimeRange);

  return (
    <HorizontalScroll className='gap-1.5 px-5 py-2'>
      {/* 1. 정렬 */}
      {sortOption && (
        <Badge
          key='sort'
          variant='outline'
          colorScheme='neutral'
          size='md'
          closable
          selected
          onClose={onRemoveSort}
        >
          {sortOption.icon}
          {sortOption.label}
        </Badge>
      )}

      {/* 2. 카테고리 (situation → cuisine → dishType) */}
      {CATEGORY_TYPES.flatMap(type =>
        categoryFilters[type].map(code => {
          const info = getCategoryInfo(type, code);
          return (
            <Badge
              key={`${type}-${code}`}
              variant='outline'
              colorScheme='neutral'
              size='md'
              closable
              selected
              onClose={() => onRemoveCategoryFilter(type, code)}
            >
              {info.icon}
              {info.name}
            </Badge>
          );
        }),
      )}

      {/* 3. 조리시간 */}
      {hasCookingTimeFilter && cookingTimeRange && (
        <Badge
          key='cookingTime'
          variant='outline'
          colorScheme='neutral'
          size='md'
          closable
          selected
          onClose={onRemoveCookingTime}
        >
          {formatCookingTime(cookingTimeRange.min)} ~{' '}
          {formatCookingTime(cookingTimeRange.max)}
        </Badge>
      )}
    </HorizontalScroll>
  );
}
