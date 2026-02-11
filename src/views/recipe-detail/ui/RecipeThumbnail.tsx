import Image from 'next/image';
import { CookingPot, ImageOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useImageError } from '@/shared/lib/useImageError';

interface RecipeThumbnailProps {
  thumbnailUrl?: string | null;
  title: string;
  className?: string;
}

export function RecipeThumbnail({ thumbnailUrl, title, className }: RecipeThumbnailProps) {
  const {
    hasValidImage,
    hasError,
    handleError,
  } = useImageError(thumbnailUrl);

  return (
    <div className={cn('relative w-full overflow-hidden rounded-b-3xl', className)}>
      {hasValidImage ? (
        <>
          <Image
            src={thumbnailUrl!}
            alt={title}
            fill
            priority
            className='object-cover'
            onError={handleError}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
        </>
      ) : hasError ? (
        <div className='flex h-full w-full items-center justify-center bg-neutral-active'>
          <ImageOff className='size-16 text-text-secondary' />
        </div>
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-neutral-active'>
          <CookingPot className='size-16 text-text-secondary' />
        </div>
      )}
    </div>
  );
}
