import { MailPlus } from 'lucide-react';
import { notFound } from 'next/navigation';

import CreateEmployeeForm from './(components)/create-employee-form';
import { getRoles } from '@/access-data/role/get-roles';

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
      <CreateEmployeeForm businessId={businessId} roles={roles} />
    </section>
  );
};

export default InvitationsPage;
