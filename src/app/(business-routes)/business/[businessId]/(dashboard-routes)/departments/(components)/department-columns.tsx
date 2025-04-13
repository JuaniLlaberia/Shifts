'use client';

import { Department } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, Tags, Text, ToggleRight } from 'lucide-react';

import CustomTableHeader from '@/components/ui/table-header';
import { CheckIcon, XIcon } from '@/components/ui/custom-check-icons';
import DepartmentActions from './department-actions';

export const columns: ColumnDef<Department & { _count: { roles: number } }>[] =
  [
    // Name
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <CustomTableHeader
            icon={<Building2 className='size-3 mr-1.5' />}
            label='Department name'
            column={column}
          />
        );
      },
      cell: ({ row }) => {
        return <p className='px-2'>{row.getValue('name')}</p>;
      },
      enableHiding: false,
    },
    // Description
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <CustomTableHeader
            icon={<Text className='size-3 mr-1.5' />}
            label='Description'
            column={column}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <p className='px-2 line-clamp-1'>{row.getValue('description')}</p>
        );
      },
      enableColumnFilter: true,
    },
    // Role Count
    {
      id: 'roles',
      accessorKey: '_count.roles',
      header: ({ column }) => {
        return (
          <CustomTableHeader
            icon={<Tags className='size-3 mr-1.5' />}
            label='Amount of roles'
            column={column}
          />
        );
      },
      cell: ({ row }) => {
        const count = row.original._count.roles;
        return (
          <p className='px-2'>
            {count || null}{' '}
            {count === 0 ? 'No roles' : count === 1 ? 'role' : 'roles'}
          </p>
        );
      },
    },
    // Active
    {
      accessorKey: 'active',
      header: ({ column }) => {
        return (
          <CustomTableHeader
            icon={<ToggleRight className='size-3 mr-1.5' />}
            label='Is active'
            column={column}
          />
        );
      },
      cell: ({ row }) => {
        const isActive = row.original.active;

        return (
          <div className='px-2'>
            <p className='flex items-center gap-1.5'>
              {isActive ? (
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
        return <DepartmentActions departmentData={data} />;
      },
    },
  ];
