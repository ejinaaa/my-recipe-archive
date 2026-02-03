import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { createClient } from '@/shared/api/supabase/server';
import { LogoutButton } from '@/shared/ui/logout-button';

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className='flex items-center gap-4'>
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className='flex gap-2'>
      <Button asChild size='sm' variant={'outline'}>
        <Link href='/auth/login'>Sign in</Link>
      </Button>
      <Button asChild size='sm' variant={'solid'}>
        <Link href='/auth/sign-up'>Sign up</Link>
      </Button>
    </div>
  );
}
