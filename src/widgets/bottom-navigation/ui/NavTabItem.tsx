import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { LinkButton } from '@/shared/ui/link-button';

interface NavTabItemProps {
  /** 탭 링크 */
  href: string;
  /** 탭 아이콘 */
  icon: LucideIcon;
  /** 탭 라벨 */
  label: string;
  /** 활성 상태 여부 */
  isActive: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}

export function NavTabItem({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: NavTabItemProps) {
  return (
    <LinkButton
      href={href}
      onClick={onClick}
      variant='ghost'
      colorScheme='neutral'
      className='flex-1 flex flex-col items-center justify-center gap-1'
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
}
