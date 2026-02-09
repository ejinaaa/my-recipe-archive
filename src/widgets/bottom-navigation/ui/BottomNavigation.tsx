'use client';

import type { LucideIcon } from 'lucide-react';
import { Home, Search, Heart, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/config';
import { useNavigationStore } from '@/shared/model';
import { LinkButton } from '@/shared/ui/link-button';

type NavTab = 'home' | 'search' | 'favorites' | 'register';

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
  const { lastSearchUrl, lastFavoritesUrl, setLastSearchUrl, setLastFavoritesUrl } =
    useNavigationStore();

  const tabs: Tab[] = [
    { id: 'home', icon: Home, label: '홈', href: ROUTES.RECIPES.LIST },
    { id: 'search', icon: Search, label: '검색', href: ROUTES.SEARCH },
    { id: 'favorites', icon: Heart, label: '즐겨찾기', href: ROUTES.FAVORITES },
    { id: 'register', icon: Plus, label: '등록하기', href: ROUTES.RECIPES.NEW },
  ];

  /** 활성 탭이면 기본 경로, 아니면 저장된 URL 사용 */
  const getHref = (id: NavTab, baseHref: string) => {
    if (activeTab === id) return baseHref;
    if (id === 'search') return lastSearchUrl ?? baseHref;
    if (id === 'favorites') return lastFavoritesUrl ?? baseHref;
    return baseHref;
  };

  /** 활성 탭 재클릭 시 저장된 URL 초기화 */
  const handleClick = (id: NavTab) => {
    if (activeTab !== id) return;
    if (id === 'search') setLastSearchUrl(null);
    if (id === 'favorites') setLastFavoritesUrl(null);
  };

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border'>
      <div className='flex items-center justify-around h-16 max-w-screen-xl mx-auto'>
        {tabs.map(({ id, icon: Icon, label, href }) => {
          const isActive = activeTab === id;

          return (
            <LinkButton
              key={id}
              href={getHref(id, href)}
              onClick={() => handleClick(id)}
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
