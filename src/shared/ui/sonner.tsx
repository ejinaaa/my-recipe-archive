'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  CircleX,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='top-center'
      icons={{
        success: <CircleCheckIcon className='size-4 text-[#5BA344]' />,
        info: <InfoIcon className='size-4 text-[#5B8DEF]' />,
        warning: <TriangleAlertIcon className='size-4 text-[#E6A117]' />,
        error: <CircleX className='size-4 text-[#E5503E]' />,
        loading: <Loader2Icon className='size-4 animate-spin text-text-secondary' />,
      }}
      toastOptions={{
        classNames: {
          toast: 'text-body-2 !rounded-xl !shadow-md',
          title: 'text-body-2 font-medium !text-text-primary',
          description: 'text-caption !text-text-secondary',
          success: '!bg-[#F2F8EC] !border-[#B9DA99]',
          error: '!bg-[#FEF2F0] !border-[#F5A898]',
          warning: '!bg-[#FFF9EE] !border-[#FFD580]',
          info: '!bg-[#EFF5FF] !border-[#A8C8F0]',
          loading: '!bg-white !border-border',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
