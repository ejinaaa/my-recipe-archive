'use client';

import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Home, Search, Heart, Plus } from 'lucide-react';
import { useFilterStore, useSortStore } from '@/features/recipe-search';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/config';
import { LinkButton } from '@/shared/ui/link-button';

type NavTab = 'home' | 'search' | 'favorites' | 'register';

/** 상태 초기화가 필요한 탭 */
const TABS_REQUIRING_RESET: NavTab[] = ['search', 'favorites'];

interface Tab {
  id: NavTab;
  icon: LucideIcon;
  label: string;
  href: string;
}

export function BottomNavigation({
  activeTab = 'search',
}: {
  activeTab?: NavTab;
}) {
  const router = useRouter();
  const resetFilters = useFilterStore(state => state.resetFilters);
  const resetSort = useSortStore(state => state.resetSort);

  const tabs: Tab[] = [
    { id: 'home', icon: Home, label: '홈', href: ROUTES.RECIPES.LIST },
    { id: 'search', icon: Search, label: '검색', href: ROUTES.SEARCH },
    { id: 'favorites', icon: Heart, label: '즐겨찾기', href: ROUTES.FAVORITES },
    { id: 'register', icon: Plus, label: '등록하기', href: ROUTES.RECIPES.NEW },
  ];

  const handleTabClick = (id: NavTab, href: string) => {
    // 검색, 즐겨찾기 탭 클릭 시 필터/정렬 상태 초기화
    if (TABS_REQUIRING_RESET.includes(id)) {
      resetFilters();
      resetSort();
    }
    router.push(href);
  };

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border'>
      <div className='flex items-center justify-around h-16 max-w-screen-xl mx-auto'>
        {tabs.map(({ id, icon: Icon, label, href }) => {
          const isActive = activeTab === id;
          const requiresReset = TABS_REQUIRING_RESET.includes(id);

          // 상태 초기화가 필요한 탭은 button, 아니면 LinkButton 사용
          if (requiresReset) {
            return (
              <button
                key={id}
                type='button'
                onClick={() => handleTabClick(id, href)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1',
                )}
              >
                <div className='relative'>
                  <Icon
                    className={cn(
                      'size-5',
                      isActive ? 'text-text-primary' : 'text-neutral-400',
                    )}
                  />
                  {isActive && (
                    <span className='absolute -top-1 -right-1 size-1.5 rounded-full bg-primary-light' />
                  )}
                </div>
                <span
                  className={cn(
                    'text-caption',
                    isActive ? 'text-text-primary' : 'text-neutral-400',
                  )}
                >
                  {label}
                </span>
              </button>
            );
          }

          return (
            <LinkButton
              key={id}
              href={href}
              variant='ghost'
              colorScheme='neutral'
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1',
              )}
            >
              <div className='relative'>
                <Icon
                  className={cn(
                    'size-5',
                    isActive ? 'text-text-primary' : 'text-neutral-400',
                  )}
                />
                {isActive && (
                  <span className='absolute -top-1 -right-1 size-1.5 rounded-full bg-primary-light' />
                )}
              </div>
              <span
                className={cn(
                  'text-caption',
                  isActive ? 'text-text-primary' : 'text-neutral-400',
                )}
              >
                {label}
              </span>
            </LinkButton>
          );
        })}
      </div>
    </nav>
  );
}
