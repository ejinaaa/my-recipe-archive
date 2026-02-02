import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Figma Foundation: Color Palette
      colors: {
        // Primary Color Scheme (주요 액션용)
        primary: {
          base: '#FF8762',
          hover: '#FF6B47',
          active: '#E65A3A',
          light: '#FFB299',
          DEFAULT: '#FF8762',
          foreground: '#FFFFFF',
        },
        // Secondary Color Scheme (보조 액션용)
        secondary: {
          base: '#B9DA99',
          hover: '#A8CC88',
          active: '#97BB77',
          light: '#D0E8BB',
          DEFAULT: '#B9DA99',
          foreground: '#33312F',
        },
        // Neutral Color Scheme (중립적 요소용)
        neutral: {
          base: '#F0F0F0',
          hover: '#E5E5E5',
          active: '#D0D0D0',
          light: '#F8F8F8',
          DEFAULT: '#F0F0F0',
        },
        // Semantic Colors (의미적 색상)
        background: '#FFFFFF',
        surface: '#FAD6AF',
        foreground: '#33312F',
        'text-primary': '#33312F',
        'text-secondary': '#666666',
        border: '#E0E0E0',
        accent: {
          DEFAULT: '#FFD580',
          foreground: '#33312F',
        },
        // Shadcn/ui 호환성 유지
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#33312F',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#33312F',
        },
        muted: {
          DEFAULT: '#F0F0F0',
          foreground: '#666666',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: '#FFFFFF',
        },
        input: '#E0E0E0',
        ring: '#FF8762',
        chart: {
          '1': 'hsl(12 76% 61%)',
          '2': 'hsl(173 58% 39%)',
          '3': 'hsl(197 37% 24%)',
          '4': 'hsl(43 74% 66%)',
          '5': 'hsl(27 87% 67%)',
        },
      },
      // Figma Foundation: Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Heading 1 - 24px Bold (제목)
        'heading-1': ['24px', { lineHeight: '29px', fontWeight: '700' }],
        // Heading 2 - 20px Bold (섹션 제목)
        'heading-2': ['20px', { lineHeight: '24px', fontWeight: '700' }],
        // Heading 3 - 18px SemiBold (카드 제목)
        'heading-3': ['18px', { lineHeight: '22px', fontWeight: '600' }],
        // Body 1 - 16px Regular (본문)
        'body-1': ['16px', { lineHeight: '19px', fontWeight: '400' }],
        // Body 2 - 14px Regular (설명, 부가 정보)
        'body-2': ['14px', { lineHeight: '17px', fontWeight: '400' }],
        // Caption - 12px Regular (작은 텍스트, 라벨)
        caption: ['12px', { lineHeight: '15px', fontWeight: '400' }],
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
