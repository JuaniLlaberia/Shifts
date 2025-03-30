'use client';

import { createContext, useState, ReactNode, useEffect, use } from 'react';
import { motion } from 'framer-motion';

type CursorType = {
  variant: 'default' | 'hover';
  content?: string;
};

type CursorContextType = {
  cursorVariant: CursorType;
  setCursorVariant: (cursor: CursorType) => void;
};

export const CursorContext = createContext<CursorContextType>({
  cursorVariant: { variant: 'default' },
  setCursorVariant: () => {},
});

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorVariant, setCursorVariant] = useState<CursorType>({
    variant: 'default',
  });

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
      {children}
    </CursorContext.Provider>
  );
};

export const CustomCursor = () => {
  const { cursorVariant } = use(CursorContext);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const cursorVariants = {
    default: {
      width: 16,
      height: 16,
      opacity: 0.75,
    },
    hover: {
      width: 75,
      height: 75,
      opacity: 0.6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1rem',
    },
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className='fixed pointer-events-none z-[9999] w-4 h-4 bg-primary rounded-full border-[1px] transition-transform'
      style={{
        left: position.x,
        top: position.y,
        position: 'fixed',
        ...cursorVariants[cursorVariant.variant],
      }}
      animate={{
        width: cursorVariant.variant === 'default' ? 16 : 75,
        height: cursorVariant.variant === 'default' ? 16 : 75,
        scale: cursorVariant.variant === 'hover' ? 1 : 1,
        transform: 'translate(-50%, -50%)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {cursorVariant.variant === 'hover' && (cursorVariant.content || 'Click')}
    </motion.div>
  );
};
