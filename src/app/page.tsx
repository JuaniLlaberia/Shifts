import Faq from '@/components/landing/faq';
import Features from '@/components/landing/features';
import Hero from '@/components/landing/hero';
import Industries from '@/components/landing/industries';
import Navbar from '@/components/landing/navbar';

const HomePage = () => {
  return (
    <div className='bg-landing-main-bg text-landing-main-text-primary'>
      <Navbar />
      <div className='flex flex-col items-center justify-center gap-10 md:gap-y-20 py-8 pt-32'>
        <Hero />
        <Features />
        <Industries />
        <Faq />
      </div>

      <div className='h-[1000px]'></div>
    </div>
  );
};

export default HomePage;
