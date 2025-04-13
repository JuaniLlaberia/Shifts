'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Edit3, MoreHorizontal, Tags, Trash2 } from 'lucide-react';
import { Department } from '@prisma/client';

import DepartmentForm from './department-form';
import DeleteDepartmentDialog from './delete-department-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DepartmentActionsProps = {
  departmentData: Department;
};

const DepartmentActions = ({ departmentData }: DepartmentActionsProps) => {
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
        <DepartmentForm
          businessId={businessId}
          departmentData={departmentData}
          onSuccess={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
        >
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            <Edit3 className='size-3.5 mr-1' />
            Edit deparment
          </DropdownMenuItem>
        </DepartmentForm>
        <DropdownMenuItem onSelect={e => e.preventDefault()} asChild>
          <Link
            href={`/business/${businessId}/roles?department=${departmentData.id}`}
          >
            <Tags className='size-3.5 mr-1' />
            See roles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteDepartmentDialog
          businessId={businessId}
          departmentId={departmentData.id}
          departmentName={departmentData.name}
        >
          <DropdownMenuItem
            onSelect={e => e.preventDefault()}
            className='hover:text-red-400! hover:[&_svg]:stroke-red-400!'
          >
            <Trash2 className='size-3.5 mr-1' />
            Delete deparment
          </DropdownMenuItem>
        </DeleteDepartmentDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DepartmentActions;
