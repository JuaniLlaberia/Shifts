import { MailPlus, Plus, UserPlus2 } from 'lucide-react';
import Link from 'next/link';

import SettingsCard from '../(components)/settings-card';
import CreateEmployeeForm from './(components)/create-employee-form';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { getRoles } from '@/access-data/role/get-roles';
import { notFound } from 'next/navigation';

const InvitationsPage = async ({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) => {
  const { businessId } = await params;

  const { roles, isAdmin } = await getRoles({ businessId });
  if (!isAdmin) return notFound();

  return (
    <section className='relative space-y-4'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <MailPlus className='size-3.5 mr-1' /> Settings / Invitations
        </p>
        <h2 className='font-medium text-lg'>Invite New Employees</h2>
      </header>
      <div className='p-8 pt-2 space-y-6'>
        <SettingsCard
          title='Add new employees'
          description='Invite your current or new employees. They will receive an email/invitation to be able to join.'
          separatorPosition='bottom'
        >
          <div className='h-full flex items-center justify-end'>
            <CreateEmployeeForm businessId={businessId} roles={roles}>
              <Button size='sm'>
                <Plus className='size-4 mr-1' />
                Add employees
              </Button>
            </CreateEmployeeForm>
          </div>
        </SettingsCard>
        <div className='w-full h-64 bg-background/25 flex flex-col gap-2 items-center justify-center border-2 border-border border-dashed rounded-xl'>
          <h6 className='flex items-center gap-1 font-medium'>
            <UserPlus2 className='size-4 mr-1' />
            Import Employees
          </h6>
          <p className='text-sm text-muted-foreground'>
            You can import employees data.{' '}
            <span>
              <Link href='/support/tutorials' className='underline'>
                See how to do it.
              </Link>
            </span>
          </p>
          <Badge color='orange'>Comming soon</Badge>
        </div>
      </div>
    </section>
  );
};

export default InvitationsPage;
