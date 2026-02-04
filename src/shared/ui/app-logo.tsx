import { cn } from '@/shared/lib/utils';

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <div
      className={cn(
        'flex size-32 items-center justify-center rounded-full bg-white shadow-md',
        className
      )}
    >
      <div className='flex size-24 items-center justify-center rounded-full bg-surface'>
        <div className='size-12 rounded-full bg-primary-base' />
      </div>
    </div>
  );
}
