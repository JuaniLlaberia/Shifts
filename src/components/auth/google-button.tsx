import { Button } from '../ui/button';
import { signIn } from '@/auth';
import { GoogleLogo } from './google-logo';

const GoogleButton = ({ message }: { message: string }) => {
  const handleGoogleSignIn = async () => {
    'use server';
    await signIn('google', { redirectTo: '/business' });
  };

  return (
    <form action={handleGoogleSignIn}>
      <Button
        className='flex-1 w-full max-w-md'
        variant='outline'
        type='submit'
      >
        <GoogleLogo />
        {message}
      </Button>
    </form>
  );
};

export default GoogleButton;
