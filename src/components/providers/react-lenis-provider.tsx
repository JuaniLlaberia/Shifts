'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';

export const ReactLenisWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });

  return children;
};
