interface KakaoIconProps {
  className?: string;
  size?: number;
}

export function KakaoIcon({ className, size = 20 }: KakaoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M10 3.33334C5.94991 3.33334 2.66663 5.98493 2.66663 9.23159C2.66663 11.2566 3.89246 13.0241 5.77496 14.0733L4.99163 17.0833C4.97079 17.1616 4.97829 17.2449 5.01246 17.3183C5.04663 17.3916 5.10579 17.4508 5.17913 17.4866C5.25246 17.5224 5.33579 17.5333 5.41579 17.5174C5.49579 17.5016 5.56829 17.4599 5.61996 17.3991L8.13663 14.4683C8.74579 14.5649 9.36829 14.6149 9.99996 14.6149C14.05 14.6149 17.3333 11.9633 17.3333 8.71659C17.3333 5.46993 14.05 3.33334 10 3.33334Z'
        fill='currentColor'
      />
    </svg>
  );
}
