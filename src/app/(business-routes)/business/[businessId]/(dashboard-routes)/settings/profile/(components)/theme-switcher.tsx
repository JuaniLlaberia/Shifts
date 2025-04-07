'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const ThemeSwitcher = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ul className='grid grid-cols-3 gap-2'>
        <li className='w-32 h-16 bg-background rounded-lg border border-border' />
        <li className='w-32 h-16 bg-background rounded-lg border border-border' />
        <li className='w-32 h-16 bg-background rounded-lg border border-border' />
      </ul>
    ); // Return null on first render when we don't know the theme
  }

  const currentTheme = theme || resolvedTheme;

  return (
    <ul className='grid grid-cols-3 gap-2'>
      {['light', 'dark', 'system'].map(opt => (
        <li
          key={opt}
          className={cn(
            'ring-2 p-0.5 rounded-xl w-auto cursor-pointer',
            currentTheme === opt ? 'ring-amber-300' : 'ring-transparent'
          )}
          onClick={() => setTheme(opt)}
        >
          <Image
            src={`/${opt}-theme.png`}
            alt={`${opt.toUpperCase()} theme`}
            width={125}
            height={60}
            className='rounded-lg border border-border'
          />
        </li>
      ))}
    </ul>
  );
};

export default ThemeSwitcher;
