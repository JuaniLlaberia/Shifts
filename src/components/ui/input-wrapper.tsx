import { CircleAlert } from 'lucide-react';
import { type ReactNode } from 'react';

import { Label } from './label';

type InputWrapperProps = {
  children: ReactNode;
  inputId?: string;
  label?: string;
  error?: string;
};

const InputWrapper = ({
  children,
  inputId,
  label,
  error,
}: InputWrapperProps) => {
  return (
    <div className='space-y-2 w-full'>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {children}
      {error && (
        <p className='flex items-center gap-2 text-sm text-destructive'>
          <CircleAlert className='size-4' /> {error}
        </p>
      )}
    </div>
  );
};

export default InputWrapper;
