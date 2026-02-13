'use client';

import type { LucideIcon } from 'lucide-react';
import { Home, Search, Heart, Plus } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { useNavigationStore } from '@/shared/model';
import { NavTabItem } from './NavTabItem';

type NavTab = 'home' | 'search' | 'favorites' | 'register';

interface Tab {
  id: NavTab;
  icon: LucideIcon;
  label: string;
  href: string;
}

const TABS: Tab[] = [
  { id: 'home', icon: Home, label: '홈', href: ROUTES.HOME },
  { id: 'search', icon: Search, label: '검색', href: ROUTES.SEARCH },
  { id: 'favorites', icon: Heart, label: '즐겨찾기', href: ROUTES.FAVORITES },
  { id: 'register', icon: Plus, label: '등록하기', href: ROUTES.RECIPES.NEW },
];

export function BottomNavigation({
  activeTab = 'search',
}: {
  activeTab?: NavTab;
}) {
  const {
    lastSearchUrl,
    lastFavoritesUrl,
    setLastSearchUrl,
    setLastFavoritesUrl,
  } = useNavigationStore();

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
    <nav className='bg-background border-t border-border'>
      <div className='flex items-center justify-around h-[70px] max-w-screen-xl mx-auto'>
        {TABS.map(({ id, icon, label, href }) => (
          <NavTabItem
            key={id}
            href={getHref(id, href)}
            icon={icon}
            label={label}
            isActive={activeTab === id}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
    </nav>
  );
}
