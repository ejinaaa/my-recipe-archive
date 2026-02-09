import imageCompression from 'browser-image-compression';
import { createClient } from '@/shared/api/supabase/client';

/** 이미지 업로드 옵션 */
interface UploadImageOptions {
  /** 저장할 버킷 이름 */
  bucket: string;
  /** 저장 경로 (예: '{userId}/{uuid}.webp') */
  path: string;
  /** 압축할 최대 파일 크기 (MB). 기본값 1 */
  maxSizeMB?: number;
  /** 압축할 최대 너비/높이 (px). 기본값 1024 */
  maxWidthOrHeight?: number;
}

/**
 * 이미지를 압축하고 Supabase Storage에 업로드
 * @returns 업로드된 이미지의 public URL
 */
export const uploadImage = async (
  file: File,
  options: UploadImageOptions,
): Promise<string> => {
  const { bucket, path, maxSizeMB = 1, maxWidthOrHeight = 1024 } = options;

  const compressedFile = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp',
  });

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, compressedFile, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (error) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
};

/**
 * Supabase Storage에서 이미지 삭제
 */
export const deleteImage = async (
  bucket: string,
  path: string,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error('이미지 삭제에 실패했습니다.');
  }
};

/**
 * public URL에서 Storage 경로 추출
 * URL 형식: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
 */
export const extractPathFromUrl = (url: string, bucket: string): string | null => {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.substring(index + marker.length);
};
