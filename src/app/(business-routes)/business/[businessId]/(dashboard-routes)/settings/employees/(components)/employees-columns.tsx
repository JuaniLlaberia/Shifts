'use client';

import { EmployeeStatus, Permissions } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { AtSign, CircleDotDashed, Shield, Tags, User } from 'lucide-react';

import Badge from '@/components/ui/badge';
import CustomTableHeader from '@/components/ui/table-header';
import EmployeeActions from './employee-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckIcon, XIcon } from '@/components/ui/custom-check-icons';

export type EmployeeDataType = {
  id: string;
  status: EmployeeStatus;
  user: {
    fullName: string | null;
    email: string;
    image: string | null;
  };
  role: {
    name: string;
    color: string;
    permissions: Permissions;
  };
};

export const columns: ColumnDef<EmployeeDataType>[] = [
  // Full name + avatar
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<User className='size-3 mr-1.5' />}
          label='Employee name'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const values = row.original;
      const fullName = values.user.fullName;
      const image = values.user.image;

      return (
        <div className='flex items-center gap-1.5 px-1.5'>
          <Avatar className='size-7 shrink-0'>
            <AvatarImage src={image ?? undefined} alt='Profile photo' />
            <AvatarFallback>{fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className='px-2'>{fullName}</p>
        </div>
      );
    },
    enableHiding: false,
  },
  // Email address
  {
    id: 'email',
    accessorKey: 'user.email',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<AtSign className='size-3 mr-1.5' />}
          label='Email address'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const email = row.original.user.email;
      return <p className='px-2'>{email}</p>;
    },
    enableColumnFilter: true,
  },
  // Employee status
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<CircleDotDashed className='size-3 mr-1.5' />}
          label='Employee Status'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.original.status.toLocaleLowerCase();
      return (
        <Badge decorated color='purple'>
          {status}
        </Badge>
      );
    },
  },
  // Position/Role
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Tags className='size-3 mr-1.5' />}
          label='Position'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const roleName = row.original.role.name;
      const roleColor = row.original.role.color;
      return (
        <Badge decorated color={roleColor}>
          {roleName}
        </Badge>
      );
    },
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
      const isAdmin = row.original.role.permissions === 'ADMIN';

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
      return (
        <EmployeeActions
          employeeName={data.user.fullName}
          employeeId={data.id}
        />
      );
    },
  },
];
