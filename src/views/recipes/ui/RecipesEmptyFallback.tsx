import { BookOpen } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { LinkButton } from '@/shared/ui/link-button';

export function RecipesEmptyFallback() {
  return (
    <div className='flex flex-col items-center justify-center py-20 px-3'>
      <BookOpen className='size-12 text-text-secondary mb-4' />
      <p className='text-body-1 text-text-secondary text-center'>
        아직 등록한 레시피가 없어요
      </p>
      <p className='text-body-2 text-text-secondary text-center mt-1'>
        나만의 레시피를 추가해 보세요
      </p>
      <LinkButton
        href={ROUTES.RECIPES.NEW}
        variant='solid'
        colorScheme='primary'
        size='md'
        className='mt-4'
      >
        레시피 추가하기
      </LinkButton>
    </div>
  );
}
