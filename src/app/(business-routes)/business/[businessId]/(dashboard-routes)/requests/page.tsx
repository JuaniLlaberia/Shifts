import { RequestStatus, RequestType } from '@prisma/client';
import { notFound } from 'next/navigation';

import { getRequests } from '@/access-data/request/get-requests';
import { DataTable } from '@/components/ui/data-table';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from '@/lib/consts';
import { columns } from './(components)/requests-columns';
import { REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS } from '@/lib/dictionaries';

const REQUESTS_FILTERS = [
  {
    label: 'Type',
    field: 'type',
    options: Object.entries(REQUEST_TYPE_LABELS).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },
  {
    label: 'Status',
    field: 'status',
    options: Object.entries(REQUEST_STATUS_LABELS).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },
];

const RequestsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{
    type: RequestType;
    status: RequestStatus;
    page: number;
  }>;
}) => {
  const { businessId } = await params;
  const { type, status, page } = await searchParams;

  const { requests, isAdmin } = await getRequests({
    businessId,
    type,
    status,
    page: page || INITIAL_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  if (!isAdmin) return notFound();

  return (
    <section className='p-8 space-y-4'>
      <header className='flex items-center justify-between'>
        <h1 className='text-lg font-medium'>All Requests</h1>
      </header>

      <DataTable
        data={requests}
        columns={columns}
        searchField='name'
        filters={REQUESTS_FILTERS}
      />
    </section>
  );
};

export default RequestsPage;
