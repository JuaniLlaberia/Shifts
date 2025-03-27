import Faq from '@/components/landing/faq';
import Features from '@/components/landing/features';
import Hero from '@/components/landing/hero';
import Industries from '@/components/landing/industries';

const HomePage = () => {
  return (
    <>
      <Hero />
      {/* TODO: Add extra section here */}
      <Features />
      <Industries />
      <Faq />
    </>
  );
};

export default HomePage;
