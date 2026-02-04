import { cn } from '@/shared/lib/utils';

interface AppLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function AppLogo({ className, ...props }: AppLogoProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      // 고정된 width, height 대신 viewBox를 설정합니다.
      viewBox='0 0 512 512'
      fill='none'
      // className에서 size를 조절할 수 있게 합니다. 기본값 size-8
      className={cn('w-28 h-28 select-none', className)}
      {...props}
    >
      <rect width={512} height={512} fill='#FAD6AF' rx={100} />
      <g filter='url(#a)'>
        <path
          fill='#fff'
          d='M430 256c0 96.098-77.902 174-174 174S82 352.098 82 256 159.902 82 256 82s174 77.902 174 174Z'
        />
      </g>
      <circle cx={255.5} cy={255.5} r={96.5} fill='#FF8762' />
      <defs>
        <filter
          id='a'
          width={388}
          height={388}
          x={62}
          y={66}
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
        >
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            result='hardAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={10} />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
          <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_19_11' />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_19_11'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
}
