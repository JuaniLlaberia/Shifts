'use client';

import { Role } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, Palette, Shield, Tag } from 'lucide-react';

import CustomTableHeader from '@/components/ui/table-header';
import { CheckIcon, XIcon } from '@/components/ui/custom-check-icons';
import Badge from '@/components/ui/badge';
import RoleActions from './role-actions';

export const columns: ColumnDef<
  Role & {
    department: {
      name: string;
    };
  }
>[] = [
  // Name
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Tag className='size-3 mr-1.5' />}
          label='Role name'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return <p className='px-2'>{row.getValue('name')}</p>;
    },
    enableHiding: false,
  },
  // Color
  {
    accessorKey: 'color',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Palette className='size-3 mr-1.5' />}
          label='Color identifier'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Badge decorated color={row.getValue('color')}>
          {row.getValue('color')}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  // Department
  {
    accessorKey: 'department.name',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Building2 className='size-3 mr-1.5' />}
          label='Department'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const department = row.original.department.name;
      return <p className='px-2'>{department}</p>;
    },
    enableHiding: false,
  },
  // Permissions
  {
    accessorKey: 'admin',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Shield className='size-3 mr-1.5' />}
          label='Administrator'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const isAdmin = row.original.permissions === 'ADMIN';

      return (
        <div className='px-2'>
          <p className='flex items-center gap-1.5'>
            {isAdmin ? (
              <>
                <CheckIcon />
                <span className='text-sm'>Yes</span>
              </>
            ) : (
              <>
                <XIcon />
                <span className='text-sm'>No</span>
              </>
            )}
          </p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableResizing: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      const data = row.original;
      return <RoleActions roleData={data} />;
    },
  },
];
