'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Trash2, Loader2, CookingPot, ImageOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ThumbnailUploaderProps {
  /** 현재 썸네일 URL */
  thumbnailUrl: string;
  /** 업로드 중 여부 */
  isUploading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 파일 선택 시 호출 */
  onFileSelect: (file: File) => void;
  /** 삭제 시 호출 */
  onDelete: () => void;
}

/**
 * 레시피 썸네일 이미지 업로드/삭제 컴포넌트
 */
export function ThumbnailUploader({
  thumbnailUrl,
  isUploading,
  error,
  disabled = false,
  onFileSelect,
  onDelete,
}: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);

  // thumbnailUrl이 바뀌면 에러 상태 리셋
  useEffect(() => {
    setImgError(false);
  }, [thumbnailUrl]);

  const handleClick = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = '';
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <section className='flex flex-col items-center gap-2'>
      <div
        className={cn(
          'relative size-24',
          'cursor-pointer transition-opacity',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed',
        )}
        onClick={handleClick}
      >
        {/* 원형 이미지 영역 */}
        <div
          className={cn(
            'size-24 rounded-full overflow-hidden',
            'flex items-center justify-center',
            thumbnailUrl && !imgError ? '' : 'bg-neutral-base',
          )}
        >
          {thumbnailUrl && !imgError ? (
            <Image
              src={thumbnailUrl}
              alt='레시피 썸네일'
              fill
              className='object-cover rounded-full'
              onError={() => setImgError(true)}
            />
          ) : thumbnailUrl && imgError ? (
            <ImageOff className='size-8 text-text-secondary/60' />
          ) : (
            <CookingPot className='size-8 text-text-secondary/60' />
          )}
        </div>

        {/* 업로드 중 오버레이 */}
        {isUploading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full'>
            <Loader2 className='size-6 text-white animate-spin' />
          </div>
        )}

        {/* 카메라 아이콘 (이미지 없을 때) */}
        {!thumbnailUrl && !isUploading && (
          <div className='absolute -bottom-1 -right-1 size-8 rounded-full bg-white border border-neutral-base flex items-center justify-center'>
            <Camera className='size-4 text-text-secondary' />
          </div>
        )}

        {/* 삭제 버튼 (이미지 있을 때) */}
        {thumbnailUrl && !isUploading && !disabled && (
          <button
            type='button'
            className='absolute -top-1 -right-1 size-7 rounded-full bg-white border border-neutral-base flex items-center justify-center shadow-sm'
            onClick={handleDeleteClick}
            aria-label='썸네일 삭제'
          >
            <Trash2 className='size-3.5 text-destructive' />
          </button>
        )}
      </div>

      {/* 안내 텍스트 또는 에러 메시지 */}
      {error ? (
        <span className='text-caption text-destructive'>{error}</span>
      ) : imgError ? (
        <span className='text-caption text-destructive'>
          이미지를 불러올 수 없어요
        </span>
      ) : (
        <span className='text-caption text-text-secondary'>
          {thumbnailUrl
            ? '사진을 클릭해서 변경할 수 있어요'
            : '요리 사진을 추가해보세요'}
        </span>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
        disabled={disabled || isUploading}
      />
    </section>
  );
}
