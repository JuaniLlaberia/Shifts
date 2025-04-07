import { getAuthUserInformation } from '@/access-data/user/get-auth-user-information';
import { User } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProfileSettingsForm from './(components)/profile-settings-form';

const ProfilePage = async () => {
  const user = await getAuthUserInformation();
  if (!user) return notFound();

  return (
    <section className='relative space-y-4'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <User className='size-3.5 mr-1' /> Settings / Profile
        </p>
        <h2 className='font-medium text-lg'>My Settings</h2>
      </header>
      <ProfileSettingsForm userData={user} />
    </section>
  );
};

export default ProfilePage;
