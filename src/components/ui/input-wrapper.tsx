import { CircleAlert } from 'lucide-react';
import { type ReactNode } from 'react';

import { Label } from './label';

type InputWrapperProps = {
  children: ReactNode;
  inputId?: string;
  label?: string;
  error?: string;
  description?: string;
};

const InputWrapper = ({
  children,
  inputId,
  label,
  error,
  description,
}: InputWrapperProps) => {
  return (
    <div className='space-y-2 w-full px-1'>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {children}
      {error && (
        <p className='flex items-center gap-2 text-sm text-destructive'>
          <CircleAlert className='size-4' /> {error}
        </p>
      )}
      {description && !error && (
        <p className='flex items-center gap-2 text-xs text-muted-foreground'>
          {description}
        </p>
      )}
    </div>
  );
};

export default InputWrapper;
