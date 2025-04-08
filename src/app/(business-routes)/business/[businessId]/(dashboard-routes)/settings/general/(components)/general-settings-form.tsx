'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Industry } from '@prisma/client';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

import SettingsCard from '../../(components)/settings-card';
import InputWrapper from '@/components/ui/input-wrapper';
import ImageUploader from '@/components/special/image-uploader';
import { updateBusiness as updateBusinessAction } from '@/actions/business/update-business';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { updateBusinessValidator } from '@/zod-validators/business';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INDUSTRY_LABELS } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import DeleteBusinessDialog from './delete-business-dialog';

type GeneralSettingsFormProps = {
  businessData: {
    id: string;
    name: string;
    industry: Industry;
    image: string | null;
  };
};

const GeneralSettingsForm = ({ businessData }: GeneralSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      businessId: businessData.id,
      name: businessData.name,
      industry: businessData.industry,
    },
    resolver: zodResolver(updateBusinessValidator),
  });

  const { mutate: updateBusiness, isPending } = useServerActionMutation(
    updateBusinessAction,
    {
      mutationKey: ['update-business'],
      onSuccess: () => toast.success('Business information updated'),
      onError: error => toast.error(error.message),
    }
  );

  const onSubmit = handleSubmit(data => {
    updateBusiness({ ...data });
  });

  return (
    <form onSubmit={onSubmit}>
      <ul className='p-8 pt-2'>
        {/* Business name */}
        <SettingsCard
          title='Business Name'
          description='Update business name which is visible for your employees.'
          inputId='name'
        >
          <InputWrapper inputId='name' error={errors.name?.message}>
            <Input
              id='name'
              className='bg-background'
              placeholder='Your business name (e.g. Coffee Store)'
              {...register('name')}
              disabled={isPending}
            />
          </InputWrapper>
        </SettingsCard>
        {/* Business industry */}
        <SettingsCard
          title='Industry'
          description='Select the industry that best describes your business.'
          inputId='industry'
        >
          <InputWrapper inputId='industry' error={errors.industry?.message}>
            <Controller
              control={control}
              name='industry'
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
                    {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              disabled={isPending}
            />
          </InputWrapper>
        </SettingsCard>
        {/* Business image */}
        <SettingsCard
          title='Business image'
          description='Upload your business image.'
        >
          <ImageUploader
            businessId={businessData.id}
            isOnboarding={false}
            onSucess={() => {
              toast.success('Image updated sucessfully');
            }}
          />
        </SettingsCard>
        <SettingsCard
          title='Danger zone'
          description='Permanently delete the business and all related data.'
        >
          <DeleteBusinessDialog businessId={businessData.id}>
            <div className='h-full flex items-center justify-end'>
              <Button type='button' size='sm' variant='destructive'>
                <Trash2 className='size-4 mr-1' /> Delete business
              </Button>
            </div>
          </DeleteBusinessDialog>
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

export default GeneralSettingsForm;
