import { Heart } from 'lucide-react';

export function FavoritesEmptyFallback() {
  return (
    <div className='flex flex-col items-center justify-center py-20 px-3'>
      <Heart className='size-12 text-text-secondary mb-4' />
      <p className='text-body-1 text-text-secondary text-center'>
        아직 즐겨찾기한 레시피가 없어요
      </p>
      <p className='text-body-2 text-text-secondary text-center mt-1'>
        마음에 드는 레시피를 찾아 저장해 보세요
      </p>
    </div>
  );
}
