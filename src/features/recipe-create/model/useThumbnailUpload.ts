'use client';

import { useState, useCallback } from 'react';
import { uploadImage } from '@/shared/api/storage';

const BUCKET = 'recipe-images';

interface UseThumbnailUploadOptions {
  /** 현재 사용자 ID */
  userId: string;
  /** 현재 설정된 thumbnail_url */
  currentUrl: string;
  /** URL 변경 콜백 */
  onUrlChange: (url: string) => void;
}

interface UseThumbnailUploadReturn {
  /** 업로드 진행 중 여부 */
  isUploading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 파일 선택 시 호출 */
  handleFileSelect: (file: File) => Promise<void>;
  /** 현재 썸네일 삭제 (로컬에서만 제거) */
  handleDelete: () => void;
}

/**
 * 레시피 썸네일 이미지 업로드/삭제 훅
 */
export function useThumbnailUpload({
  userId,
  currentUrl,
  onUrlChange,
}: UseThumbnailUploadOptions): UseThumbnailUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!userId) return;
      setIsUploading(true);
      setError(null);

      try {
        const fileName = `${userId}/${crypto.randomUUID()}.webp`;

        const publicUrl = await uploadImage(file, {
          bucket: BUCKET,
          path: fileName,
        });

        onUrlChange(publicUrl);
      } catch {
        setError('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsUploading(false);
      }
    },
    [userId, currentUrl, onUrlChange],
  );

  const handleDelete = useCallback(() => {
    if (!currentUrl) return;
    setError(null);
    // Storage에서는 삭제하지 않고 로컬에서만 URL 제거
    // 실제 삭제는 레시피 저장 시점에 서버에서 처리
    onUrlChange('');
  }, [currentUrl, onUrlChange]);

  return { isUploading, error, handleFileSelect, handleDelete };
}
