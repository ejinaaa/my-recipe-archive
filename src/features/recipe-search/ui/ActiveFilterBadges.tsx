'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import { formatCookingTime } from '@/entities/recipe/model/utils';
import type { RecipeSortBy } from '@/entities/recipe/api/server';
import { Badge } from '@/shared/ui/badge';
import type { CategoryFilters, CookingTimeRange } from '../model/store';
import { SORT_OPTIONS } from '../model/sortStore';
import { isDefaultCookingTimeRange } from '../model/hooks';
import type { FilterOrderKey } from '../model/useUrlQueryParams';

interface ActiveFilterBadgesProps {
  /** 현재 적용된 정렬 */
  sortBy: RecipeSortBy | null;
  /** 현재 적용된 카테고리 필터 */
  categoryFilters: CategoryFilters;
  /** 현재 적용된 조리시간 범위 */
  cookingTimeRange: CookingTimeRange | null;
  /** 필터 적용 순서 (URL 파라미터 순) */
  filterOrder: FilterOrderKey[];
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
 * filterOrder가 비어있으면 렌더링하지 않아 쿼리도 실행되지 않음.
 * 에러 발생 시 영역 자체를 숨김.
 */
export function ActiveFilterBadges(props: ActiveFilterBadgesProps) {
  if (props.filterOrder.length === 0) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <ActiveFilterBadgesContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * 뱃지 렌더링 내부 컴포넌트 (useSuspenseCategoryGroups 사용)
 */
function ActiveFilterBadgesContent({
  sortBy,
  categoryFilters,
  cookingTimeRange,
  filterOrder,
  onRemoveSort,
  onRemoveCategoryFilter,
  onRemoveCookingTime,
}: ActiveFilterBadgesProps) {
  const { data: categoryGroups } = useSuspenseCategoryGroups();

  // 정렬 옵션 조회
  const sortOption = sortBy
    ? SORT_OPTIONS.find(opt => opt.value === sortBy)
    : null;

  // 카테고리 코드 → { icon, name } 변환
  const getCategoryInfo = (type: CategoryType, code: string) => {
    const group = categoryGroups.find(g => g.type === type);
    const option = group?.options.find(opt => opt.code === code);
    return { icon: option?.icon, name: option?.name ?? code };
  };

  // 조리시간 필터 활성 여부
  const hasCookingTimeFilter =
    cookingTimeRange !== null && !isDefaultCookingTimeRange(cookingTimeRange);

  // filterOrder를 순회하며 뱃지를 순서대로 직접 빌드
  const badges = filterOrder.flatMap(orderKey => {
    if (orderKey === 'sort' && sortOption) {
      return (
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
      );
    }

    if (
      (orderKey === 'situation' || orderKey === 'cuisine' || orderKey === 'dishType') &&
      categoryFilters[orderKey].length > 0
    ) {
      return categoryFilters[orderKey].map(code => {
        const info = getCategoryInfo(orderKey, code);
        return (
          <Badge
            key={`${orderKey}-${code}`}
            variant='outline'
            colorScheme='neutral'
            size='md'
            closable
            selected
            onClose={() => onRemoveCategoryFilter(orderKey, code)}
          >
            {info.icon}
            {info.name}
          </Badge>
        );
      });
    }

    if (orderKey === 'cookingTime' && hasCookingTimeFilter && cookingTimeRange) {
      return (
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
      );
    }

    return [];
  });

  if (badges.length === 0) return null;

  return (
    <div className='flex gap-1.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      {badges}
    </div>
  );
}
