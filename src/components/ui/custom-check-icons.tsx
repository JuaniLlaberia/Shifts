import { Check, X } from 'lucide-react';

export const CheckIcon = () => (
  <span className='bg-green-300 dark:bg-green-600 rounded-full p-0.5'>
    <Check className='size-2' strokeWidth={3} />
  </span>
);

export const XIcon = () => (
  <span className='bg-red-400 dark:bg-red-600 rounded-full p-0.5'>
    <X className='size-2' strokeWidth={3} />
  </span>
);
