'use client';

import {
  Request,
  SwapRequest,
  UnavailableRequest,
  VacationRequest,
} from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, CircleDotDashed, Tag, User } from 'lucide-react';
import { format } from 'date-fns';

import Badge from '@/components/ui/badge';
import CustomTableHeader from '@/components/ui/table-header';
import RequestActions from './request-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type PopulatedRequest = Request & {
  employee: {
    user: { fullName: string | null; image: string | null };
  };
  swapRequest: SwapRequest | null;
  unavailableRequest: UnavailableRequest | null;
  vacationRequest: VacationRequest | null;
};

export const columns: ColumnDef<PopulatedRequest>[] = [
  // Full name + avatar
  {
    id: 'name',
    accessorKey: 'employee.user.fullName',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<User className='size-3 mr-1.5' />}
          label='Employee'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const values = row.original;
      const fullName = values.employee.user.fullName;
      const image = values.employee.user.image;

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
  // Request type
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Tag className='size-3 mr-1.5' />}
          label='Type'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const type = row.original.type.toLocaleLowerCase();
      return (
        <Badge decorated color='purple'>
          {type}
        </Badge>
      );
    },
  },
  // Request status
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<CircleDotDashed className='size-3 mr-1.5' />}
          label='Status'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === 'APPROVED'
          ? 'green'
          : status === 'PENDING'
          ? 'orange'
          : 'red';
      return (
        <Badge decorated color={color}>
          {status.toLocaleLowerCase()}
        </Badge>
      );
    },
  },
  // Created at
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<CalendarDays className='size-3 mr-1.5' />}
          label='Requested at'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <p className='px-2'>{format(date, 'MM/dd/yyyy')}</p>;
    },
  },
  {
    id: 'actions',
    enableResizing: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      const data = row.original;

      return <RequestActions requestData={data} />;
    },
  },
];
