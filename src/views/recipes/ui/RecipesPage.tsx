'use client';

import { AppLogo } from '@/shared/ui/app-logo';

export function RecipesPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-20'>
      <div className='flex flex-col items-center justify-center gap-3'>
        <AppLogo />

        <h1 className='text-heading-1 text-text-primary'>
          My
          <span className='text-heading-1 text-text-primary'> Recipe </span>
          Archive
        </h1>

        <p className='text-body-1 text-text-secondary mt-4'>
          레시피 페이지입니다. 곧 멋진 콘텐츠가 추가될 예정입니다!
        </p>
      </div>

      <div className='w-full max-w-2xl p-8 rounded-lg border border-border bg-surface'>
        <h2 className='text-heading-2 text-text-primary mb-4'>
          로그인 성공! 🎉
        </h2>
        <p className='text-body-2 text-text-secondary'>
          카카오 로그인이 정상적으로 완료되었습니다.
          <br />
          이제 이 페이지에서 레시피 관련 기능을 구현할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
