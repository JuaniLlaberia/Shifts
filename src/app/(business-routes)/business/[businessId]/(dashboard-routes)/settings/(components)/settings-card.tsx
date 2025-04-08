import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const SettingsCard = ({
  children,
  title,
  description,
  inputId,
  separatorPosition = 'top',
}: {
  children: ReactNode;
  title: string;
  description: string;
  inputId?: string;
  separatorPosition?: 'bottom' | 'top';
}) => {
  return (
    <li
      className={cn(
        'grid grid-cols-1 gap-5 md:gap-1 md:grid-cols-2 w-full border-border py-5 px-3',
        separatorPosition === 'top' ? 'border-t' : 'border-b'
      )}
    >
      <div>
        <label htmlFor={inputId} className='text-sm font-medium'>
          {title}
        </label>
        <p className='text-sm text-muted-foreground max-w-lg'>{description}</p>
      </div>
      <div className='flex flex-col gap-2.5 max-w-sm'>{children}</div>
    </li>
  );
};

export default SettingsCard;
