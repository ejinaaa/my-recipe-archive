'use client';

import Image from 'next/image';
import { ImageOff, User } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import type { Profile } from '@/entities/user/model/types';

interface ProfileGreetingProps {
  profile?: Profile | null;
}

export function ProfileGreeting({ profile }: ProfileGreetingProps) {
  const {
    hasValidImage: hasProfileImage,
    hasError: profileImageError,
    handleError: handleProfileImageError,
  } = useImageError(profile?.image_url);

  return (
    <div className='flex items-center gap-3'>
      <div className='relative size-10 rounded-full bg-neutral-200 overflow-hidden'>
        {hasProfileImage ? (
          <Image
            src={profile!.image_url!}
            alt='프로필'
            fill
            className='object-cover'
            onError={handleProfileImageError}
          />
        ) : profileImageError ? (
          <ImageOff className='size-5 text-text-secondary' />
        ) : (
          <User className='size-full p-2 text-text-secondary' />
        )}
      </div>
      <div>
        <p className='text-heading-2 text-text-primary'>
          안녕, {profile?.nickname || '요리사'}님
        </p>
        <p className='pt-0.5 text-body-2 text-text-secondary'>
          오늘은 뭘 먹을까요?
        </p>
      </div>
    </div>
  );
}
