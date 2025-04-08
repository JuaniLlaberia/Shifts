import { Bell } from 'lucide-react';

import SettingsCard from '../(components)/settings-card';
import { Switch } from '@/components/ui/switch';

const NotificationsPage = async () => {
  return (
    <section className='relative space-y-4'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <Bell className='size-3.5 mr-1' /> Settings / Notifications
        </p>
        <h2 className='font-medium text-lg'>Notifications Preferences</h2>
      </header>
      <div className='p-8 pt-2'>
        <SettingsCard
          title='Inbox'
          description='Receive updates directly in your app inbox.'
        >
          <div className='h-full flex items-center justify-end'>
            <Switch />
          </div>
        </SettingsCard>
        <SettingsCard
          title='Email'
          description='Get notified via email about important activity.'
        >
          <div className='h-full flex items-center justify-end'>
            <Switch />
          </div>
        </SettingsCard>
        <SettingsCard
          title='Browser'
          description='Allow push notifications in your browser for real-time updates.'
        >
          <div className='h-full flex items-center justify-end'>
            <Switch />
          </div>
        </SettingsCard>
      </div>
    </section>
  );
};

export default NotificationsPage;
