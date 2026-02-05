'use client';

import { Home, Search, Heart, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

type NavTab = 'home' | 'search' | 'favorites' | 'register';

interface BottomNavigationProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

export function BottomNavigation({
  activeTab = 'search',
  onTabChange,
}: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as NavTab, icon: Home, label: '홈' },
    { id: 'search' as NavTab, icon: Search, label: '검색' },
    { id: 'favorites' as NavTab, icon: Heart, label: '즐겨찾기' },
    { id: 'register' as NavTab, icon: Plus, label: '등록하기' },
  ];

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border'>
      <div className='flex items-center justify-around h-16 max-w-screen-xl mx-auto'>
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <Button
              key={id}
              onClick={() => onTabChange?.(id)}
              variant='ghost'
              colorScheme='neutral'
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'hover:bg-neutral-base/50'
              )}
            >
              <Icon
                className={cn(
                  'size-5',
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                )}
              />
              <span
                className={cn(
                  'text-caption',
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                {label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
