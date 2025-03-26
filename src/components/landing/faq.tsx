import { getTranslations } from 'next-intl/server';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const QUESTIONS = [
  {
    question: 'Placeholder',
    answer: 'Placeholder',
  },
  {
    question: 'Placeholder',
    answer: 'Placeholder',
  },
  {
    question: 'Placeholder',
    answer: 'Placeholder',
  },
  {
    question: 'Placeholder',
    answer: 'Placeholder',
  },
  {
    question: 'Placeholder',
    answer: 'Placeholder',
  },
];

const Faq = async () => {
  const t = await getTranslations('homepage.faq');

  return (
    <section className='w-[90%] grid grid-cols-1 md:grid-cols-7 gap-12 py-16 px-2 md:px-20'>
      <div className='col-span-3'>
        <h3 className='text-5xl font-medium'>{t('title')}</h3>
      </div>
      <Accordion type='single' collapsible className='col-span-4 space-y-2.5'>
        {QUESTIONS.map(({ question, answer }, i) => (
          <AccordionItem
            key={i}
            value={`value-${i}`}
            className='text-lg cursor-pointer hover:border-b-0 hover:scale-[101%] hover:bg-white hover:border hover:border-border rounded-xl rounded-b-none hover:rounded-b-xl transition-all duration-150'
          >
            <AccordionTrigger className='text-xl font-normal px-2.5 cursor-pointer'>
              {question}
            </AccordionTrigger>
            <AccordionContent className='text-lg p-4'>
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Faq;
