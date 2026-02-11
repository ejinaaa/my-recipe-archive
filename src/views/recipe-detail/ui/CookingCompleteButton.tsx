'use client';

import { useEffect, useState } from 'react';
import { Check, ChefHat, Loader2 } from 'lucide-react';
import { useAddCookingLog } from '@/entities/cooking-log/api/hooks';
import { Button } from '@/shared/ui/button';

interface CookingCompleteButtonProps {
  userId: string;
  recipeId: string;
}

export function CookingCompleteButton({
  userId,
  recipeId,
}: CookingCompleteButtonProps) {
  const addCookingLog = useAddCookingLog();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  if (showSuccess) {
    return (
      <Button
        variant='solid'
        colorScheme='secondary'
        className='w-full animate-in zoom-in-95 duration-300'
      >
        <Check className='size-5' />
        오늘도 수고했어요!
      </Button>
    );
  }

  return (
    <Button
      variant='solid'
      colorScheme='primary'
      className='w-full'
      disabled={addCookingLog.isPending}
      onClick={() =>
        addCookingLog.mutate(
          { userId, recipeId },
          { onSuccess: () => setShowSuccess(true) },
        )
      }
    >
      {addCookingLog.isPending ? (
        <>
          <Loader2 className='size-5 animate-spin' />
          기록하는 중...
        </>
      ) : (
        <>
          <ChefHat className='size-5' />
          요리 완료!
        </>
      )}
    </Button>
  );
}
