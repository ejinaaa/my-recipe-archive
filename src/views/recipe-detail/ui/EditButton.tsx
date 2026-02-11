import { Pencil } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { LinkButton } from '@/shared/ui/link-button';

interface EditButtonProps {
  recipeId: string;
}

export function EditButton({ recipeId }: EditButtonProps) {
  return (
    <LinkButton
      href={ROUTES.RECIPES.EDIT(recipeId)}
      variant='solid'
      colorScheme='neutral'
      size='sm'
      transparent
      className='size-10 p-0'
      aria-label='레시피 수정'
    >
      <Pencil className='size-5' />
    </LinkButton>
  );
}
