'use client';

import { useState } from 'react';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import { Role } from '@prisma/client';
import { useParams } from 'next/navigation';

import DeleteRoleDialog from './delete-role-dialog';
import RoleForm from './role-form';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type RoleActionsProps = {
  roleData: Role;
};

const RoleActions = ({ roleData }: RoleActionsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { businessId } = useParams<{ businessId: string }>();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          className='rounded-lg border border-transparent hover:bg-background hover:border-border data-[state=open]:bg-background data-[state=open]:border-border transition-transform'
        >
          <MoreHorizontal className='size-4 text-muted-foreground' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='bottom'>
        <RoleForm
          businessId={businessId}
          roleData={roleData}
          onSuccess={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
        >
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            <Edit3 className='size-3.5 mr-1' />
            Edit deparment
          </DropdownMenuItem>
        </RoleForm>
        <DropdownMenuSeparator />
        <DeleteRoleDialog
          businessId={businessId}
          roleId={roleData.id}
          roleName={roleData.name}
        >
          <DropdownMenuItem
            onSelect={e => e.preventDefault()}
            className='hover:text-red-400! hover:[&_svg]:stroke-red-400!'
          >
            <Trash2 className='size-3.5 mr-1' />
            Delete deparment
          </DropdownMenuItem>
        </DeleteRoleDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleActions;
