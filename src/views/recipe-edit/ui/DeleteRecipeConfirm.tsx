import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

interface DeleteRecipeConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteRecipeConfirm({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteRecipeConfirmProps) {
  return (
    <Drawer open={open} onOpenChange={open => !isPending && onOpenChange(open)}>
      <DrawerContent>
        <DrawerHeader className='flex flex-col items-center'>
          <DrawerTitle>정말 삭제하시겠어요?</DrawerTitle>
          <DrawerDescription>
            삭제한 레시피는 다시 되돌릴 수 없어요
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            variant='solid'
            colorScheme='primary'
            size='lg'
            onClick={onConfirm}
            disabled={isPending}
            className='w-full'
          >
            {isPending ? '삭제하는 중...' : '네, 삭제할게요'}
          </Button>
          <Button
            variant='outline'
            colorScheme='neutral'
            size='lg'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className='w-full'
          >
            아니요, 돌아갈게요
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
