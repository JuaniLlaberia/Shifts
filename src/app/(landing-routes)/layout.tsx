import Footer from '@/components/landing/footer';
import Navbar from '@/components/landing/navbar';
import type { ReactNode } from 'react';
import { CursorProvider, CustomCursor } from '../../context/cursor-context';
import { ReactLenisWrapper } from '@/components/providers/react-lenis-provider';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <CursorProvider>
      <ReactLenisWrapper>
        <main className='bg-landing-main-bg text-landing-main-text-primary'>
          <Navbar />
          <div className='flex flex-col items-center justify-center gap-10 md:gap-y-20 py-8 pt-32'>
            {children}
            <Footer />
          </div>
        </main>
      </ReactLenisWrapper>
      <CustomCursor />
    </CursorProvider>
  );
};

export default MainLayout;
