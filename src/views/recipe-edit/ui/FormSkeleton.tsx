import { Skeleton } from '@/shared/ui/skeleton';

export function FormSkeleton() {
  return (
    <div className='px-5 pt-6 flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-2'>
        <Skeleton className='size-24 rounded-full' />
        <Skeleton className='h-3 w-32' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-12 w-full rounded-xl' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-24 w-full rounded-xl' />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className='flex flex-col gap-3'>
          <Skeleton className='h-4 w-24' />
          <div className='flex flex-wrap gap-2'>
            {[1, 2, 3, 4, 5].map(j => (
              <Skeleton key={j} className='h-8 w-16 rounded-full' />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
