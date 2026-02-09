'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';

interface ErrorBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry?: () => void;
  onCancel?: () => void;
  onHome?: () => void;
  title?: string;
  description?: string;
}

export function ErrorBottomSheet({
  open,
  onOpenChange,
  onRetry,
  onCancel,
  onHome,
  title = '이런, 뭔가 잘못됐어요',
  description = '일시적인 문제예요. 다시 시도해주세요',
}: ErrorBottomSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='flex flex-col items-center'>
          <AlertCircle className='size-10 text-text-secondary mb-2' />
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          {onRetry && (
            <Button
              variant='solid'
              colorScheme='primary'
              size='lg'
              onClick={onRetry}
              className='w-full'
            >
              다시 시도
            </Button>
          )}
          {onHome && (
            <Button
              variant='solid'
              colorScheme='neutral'
              size='lg'
              onClick={onHome}
              className='w-full'
            >
              홈으로
            </Button>
          )}
          {onCancel && (
            <Button
              variant='solid'
              colorScheme='neutral'
              size='lg'
              onClick={onCancel}
              className='w-full'
            >
              닫기
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
