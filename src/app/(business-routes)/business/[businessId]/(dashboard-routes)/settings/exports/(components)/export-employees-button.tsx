'use client';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import SettingsCard from '../../(components)/settings-card';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { Button } from '@/components/ui/button';
import { generateEmployeesCsvData } from '@/actions/employee/generate-csv-data';

const ExportEmployeesButton = ({ businessId }: { businessId: string }) => {
  const { mutate: exportData, isPending } = useServerActionMutation(
    generateEmployeesCsvData,
    {
      mutationKey: ['generate-employees-csv-data'],
      onSuccess: employeesCSV => {
        const blob = new Blob([employeesCSV], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'employees.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success('Employees data successfully exported');
      },
      onError: err => {
        console.log(err);
        toast.error('Failed to export employees data');
      },
    }
  );

  return (
    <SettingsCard
      title='Export Employees Data'
      description='Export your employees data (fullName, email, position and more) in CSV format.'
    >
      <div className='h-full flex items-center justify-end'>
        <Button
          size='sm'
          onClick={() => exportData({ businessId })}
          disabled={isPending}
        >
          Export Employees
          {isPending && <Loader2 className='size-4 ml-1 animate-spin' />}
        </Button>
      </div>
    </SettingsCard>
  );
};

export default ExportEmployeesButton;
