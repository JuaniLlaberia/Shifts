'use client';

import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Mail, Plus, X } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type InviteEmployeeStepProps = {
  children: ReactNode;
  handleChangeStep?: (step: number, skip?: boolean) => void;
};

const InviteEmployeeStep = ({
  children,
  handleChangeStep,
}: InviteEmployeeStepProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [crrEmail, setCrrEmail] = useState<string>('');
  const [emails, setEmails] = useState<string[]>([]);

  const addEmail = () => {
    if (emails.includes(crrEmail)) {
      toast.error('Email already added', {
        description: `${crrEmail} is already in the invitation list.`,
      });
      return;
    }

    setEmails(prev => [...prev, crrEmail]);
    setCrrEmail('');
  };

  // Remove email from the list
  function removeEmail(email: string) {
    setEmails(emails.filter(e => e !== email));
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invite your first Employee</AlertDialogTitle>
          <AlertDialogDescription>
            Invitations are send my email and also in the invitations section.{' '}
            <span className='font-medium'>
              You can invite more in the dashboard.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={e => {
            e.preventDefault();
            addEmail();
          }}
          className='py-4'
        >
          <div className='flex space-x-2'>
            <div className='relative flex-1'>
              <Input
                placeholder='email@example.com'
                className='pl-10'
                value={crrEmail}
                onChange={e => setCrrEmail(e.target.value)}
              />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Mail className='size-4 text-muted-foreground' />
              </div>
            </div>
            <Button type='submit' size='icon'>
              <Plus className='h-4 w-4' />
              <span className='sr-only'>Add Email</span>
            </Button>
          </div>
          {emails.length > 0 && (
            <ul className='flex flex-wrap gap-2 px-2 mt-2'>
              {emails.map(email => (
                <li
                  key={email}
                  className='flex items-center gap-2.5 justify-center text-sm py-1 px-4 bg-muted rounded-full border border-border/50'
                >
                  <p className='mb-1'>{email}</p>
                  <button
                    type='button'
                    onClick={() => removeEmail(email)}
                    className='rounded-full text-muted-foreground hover:text-primary cursor-pointer'
                  >
                    <X className='size-3.5' />
                    <span className='sr-only'>Remove</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <AlertDialogFooter>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              handleChangeStep?.(4, true);
              setIsOpen(false);
            }}
          >
            Skip
          </Button>
          <Button size='sm'>Complete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InviteEmployeeStep;
