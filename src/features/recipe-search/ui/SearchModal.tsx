'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/shared/ui/input-group';
import { useCategoryGroups } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import {
  useSearchStore,
  toggleCategoryFilter,
  type CategoryFilters,
} from '../model/store';
import { CategoryFilterSection } from './CategoryFilterSection';

/**
 * 카테고리 타입 정렬 순서
 */
const CATEGORY_TYPE_ORDER: CategoryType[] = [
  'situation',
  'cuisine',
  'dishType',
];

export function SearchModal() {
  const { isOpen, searchQuery, categoryFilters, closeModal, applySearch } =
    useSearchStore();

  // 로컬 상태 (모달 내 편집용)
  const [tempQuery, setTempQuery] = useState(searchQuery);
  const [tempFilters, setTempFilters] =
    useState<CategoryFilters>(categoryFilters);

  // 카테고리 데이터 조회
  const {
    data: categoryGroups,
    isLoading,
    isError,
    refetch,
  } = useCategoryGroups();

  // 모달 열릴 때 전역 상태를 로컬로 복사
  // 의존성에서 searchQuery와 categoryFilters를 제외하여
  // 모달이 열려있는 동안 로컬 상태가 리셋되는 것을 방지
  useEffect(() => {
    if (isOpen) {
      setTempQuery(searchQuery);
      setTempFilters(categoryFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  const handleToggleCategory = (type: CategoryType, code: string) => {
    setTempFilters(prev => toggleCategoryFilter(prev, type, code));
  };

  const handleSearch = () => {
    applySearch(tempQuery, tempFilters);
    // TODO: 검색 결과 페이지로 이동 구현
  };

  const handleClose = () => {
    closeModal();
  };

  const handleClearInput = () => {
    setTempQuery('');
  };

  // 카테고리 그룹을 정렬된 순서로 변환
  const sortedGroups = CATEGORY_TYPE_ORDER.map(type => {
    const group = categoryGroups?.find(g => g.type === type);
    return {
      type,
      options: group?.options ?? [],
    };
  });

  // 검색 조건이 하나라도 있는지 확인
  const hasSearchCondition =
    tempQuery.trim().length > 0 ||
    tempFilters.situation.length > 0 ||
    tempFilters.cuisine.length > 0 ||
    tempFilters.dishType.length > 0;

  return (
    <div className='fixed inset-0 z-50 bg-background flex flex-col'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-background px-4 pt-4 pb-3'>
        <div className='flex items-center gap-2'>
          <BackButton onBack={handleClose} />
          <InputGroup size='sm' className='flex-1'>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder='어떤 요리를 찾으세요?'
              value={tempQuery}
              onChange={e => setTempQuery(e.target.value)}
              autoFocus
            />
            {tempQuery && (
              <InputGroupButton
                onClick={handleClearInput}
                aria-label='검색어 삭제'
                className='bg-white/80'
              >
                <X />
              </InputGroupButton>
            )}
          </InputGroup>
        </div>
      </header>

      {/* Content */}
      <main className='flex-1 overflow-y-auto px-4 py-4 space-y-6'>
        {sortedGroups.map(({ type, options }) => (
          <CategoryFilterSection
            key={type}
            type={type}
            options={options}
            selectedCodes={tempFilters[type]}
            onToggle={code => handleToggleCategory(type, code)}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className='sticky bottom-0 bg-background px-4 pt-3 pb-6 border-t border-neutral-base'>
        <Button
          variant='solid'
          colorScheme='primary'
          size='lg'
          className='w-full'
          onClick={handleSearch}
          disabled={!hasSearchCondition}
        >
          검색하기
        </Button>
      </footer>
    </div>
  );
}
