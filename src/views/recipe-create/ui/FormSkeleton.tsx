import { Skeleton } from '@/shared/ui/skeleton';

export function FormSkeleton() {
  return (
    <div className='px-5 pt-6 space-y-6'>
      <Skeleton className='h-10 w-full rounded-lg' />
      <Skeleton className='h-24 w-full rounded-lg' />
      <Skeleton className='h-10 w-full rounded-lg' />
      <Skeleton className='h-10 w-full rounded-lg' />
      <div className='space-y-3'>
        <Skeleton className='h-5 w-24 rounded-md' />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-16 rounded-full' />
          ))}
        </div>
      </div>
    </div>
  );
}
