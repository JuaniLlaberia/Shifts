'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

import ThemeSwitcher from './theme-switcher';
import SettingsCard from '../../(components)/settings-card';
import InputWrapper from '@/components/ui/input-wrapper';
import ImageUploader from '@/components/special/image-uploader';
import DeleteUserDialog from './delete-user-dialog';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOCALE_LABELS } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { updateUserValidator } from '@/zod-validators/user';
import { updateUser as updateUserAction } from '@/actions/user/update-user';

type ProfileSettingsFormProps = {
  userData: User;
};

const ProfileSettingsForm = ({ userData }: ProfileSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: userData.fullName ?? '',
      locale: userData.locale,
    },
    resolver: zodResolver(updateUserValidator),
  });

  const { mutate: updateUser, isPending } = useServerActionMutation(
    updateUserAction,
    {
      mutationKey: ['update-user'],
      onSuccess: () => toast.success('Profile information updated'),
      onError: error => toast.error(error.message),
    }
  );

  const onSubmit = handleSubmit(data => {
    updateUser({ ...data });
  });

  return (
    <form onSubmit={onSubmit}>
      <ul className='p-8 pt-2 pb-16'>
        {/* User name */}
        <SettingsCard
          title='Full name'
          description='Update your name which is visible for your co-workers.'
          inputId='fullName'
        >
          <InputWrapper inputId='fullName' error={errors.fullName?.message}>
            <Input
              id='fullName'
              className='bg-background'
              placeholder='Your business name (e.g. Coffee Store)'
              {...register('fullName')}
              disabled={isPending}
            />
          </InputWrapper>
        </SettingsCard>
        {/* Email address */}
        <SettingsCard
          title='Email address'
          description='Your unique identifier. It cannot be change.'
          inputId='email'
        >
          <InputWrapper inputId='email'>
            <Input
              id='email'
              className='bg-background'
              placeholder='example@email.com'
              defaultValue={userData.email}
              readOnly
              disabled={isPending}
            />
          </InputWrapper>
        </SettingsCard>
        {/* Profile image */}
        <SettingsCard
          title='Avatar'
          description='Upload your profile image. It is optional but recommended.'
        >
          <ImageUploader
            isOnboarding={false}
            onSucess={() => {
              toast.success('Avatar updated sucessfully');
            }}
          />
        </SettingsCard>
        <SettingsCard
          title='Appearance'
          description='Choose light or dark mode, or switch your mode automatically based on your system settings.'
        >
          <ThemeSwitcher />
        </SettingsCard>
        <SettingsCard
          title='Language'
          description='Customize your language. It is saved in all your devices.'
        >
          <Controller
            control={control}
            name='locale'
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                disabled={isPending}
              >
                <SelectTrigger className='w-full bg-background'>
                  <SelectValue placeholder='Select your industry' />
                </SelectTrigger>
                <SelectContent className='max-h-56'>
                  {Object.entries(LOCALE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            disabled={isPending}
          />
        </SettingsCard>
        <SettingsCard
          title='Danger zone'
          description='Choose light or dark mode, or switch your mode automatically based on your system settings.'
        >
          <DeleteUserDialog>
            <div className='flex items-center justify-end'>
              <Button type='button' size='sm' variant='destructive'>
                <Trash2 className='size-4 mr-1' /> Delete account
              </Button>
            </div>
          </DeleteUserDialog>
        </SettingsCard>
      </ul>
      <div className='fixed bottom-0 left-0 h-[3.55rem] w-full p-4 flex items-center justify-end border-t border-border bg-background space-x-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={e => {
            e.preventDefault();
            reset();
          }}
          disabled={isPending}
        >
          Reset
        </Button>
        <Button size='sm' type='submit' disabled={isPending}>
          Save changes
          {isPending && <Loader2 className='size-4 ml-1 animate-spin' />}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
