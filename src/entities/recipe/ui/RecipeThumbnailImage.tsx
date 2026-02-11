import Image from 'next/image';
import { CookingPot, ImageOff } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import { cn } from '@/shared/lib/utils';

interface RecipeThumbnailImageProps {
  /** 이미지 URL */
  src: string | null | undefined;
  /** 이미지 alt 텍스트 */
  alt: string;
  /** 폴백 아이콘 크기 클래스 (기본: 'size-10') */
  iconClassName?: string;
  /** 폴백 배경 클래스 (기본: 'bg-neutral-base') */
  fallbackClassName?: string;
  /** fill 모드 사용 여부 */
  fill?: boolean;
  /** 고정 너비 (fill=false일 때) */
  width?: number;
  /** 고정 높이 (fill=false일 때) */
  height?: number;
  /** 반응형 sizes */
  sizes?: string;
  /** 우선 로딩 여부 */
  priority?: boolean;
  /** Image 컴포넌트 className */
  imageClassName?: string;
}

/**
 * 레시피 썸네일 이미지 + 폴백 처리 컴포넌트
 * 이미지 로드 실패 시 ImageOff, 이미지 없을 시 CookingPot 아이콘 표시
 */
export function RecipeThumbnailImage({
  src,
  alt,
  iconClassName = 'size-10',
  fallbackClassName = 'bg-neutral-base',
  fill,
  width,
  height,
  sizes,
  priority,
  imageClassName = 'object-cover',
}: RecipeThumbnailImageProps) {
  const {
    hasValidImage,
    hasError: imageError,
    handleError: handleImageError,
  } = useImageError(src);

  if (hasValidImage) {
    return fill ? (
      <Image
        src={src!}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imageClassName}
        onError={handleImageError}
      />
    ) : (
      <Image
        src={src!}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
        onError={handleImageError}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        fallbackClassName,
      )}
    >
      {imageError ? (
        <ImageOff className={cn(iconClassName, 'text-text-secondary')} />
      ) : (
        <CookingPot className={cn(iconClassName, 'text-text-secondary')} />
      )}
    </div>
  );
}
