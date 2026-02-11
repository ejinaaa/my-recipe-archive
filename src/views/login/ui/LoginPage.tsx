import { AppLogo } from '@/shared/ui/app-logo';
import { KakaoLoginButton } from './KakaoLoginButton';

export function LoginPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-10 px-6 pb-20 pt-10'>
      <div className='flex flex-col items-center justify-center gap-3'>
        <AppLogo />

        <h1 className='text-heading-1 text-text-primary'>
          My
          <span className='text-heading-1 text-text-primary'> Recipe </span>
          Archive
        </h1>
      </div>

      <div className='w-full max-w-md'>
        <KakaoLoginButton />
      </div>
    </div>
  );
}
