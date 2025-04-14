'use client';

import ExcelJS from 'exceljs';
import Link from 'next/link';
import Dropzone, { FileRejection } from 'react-dropzone';
import { Loader2, MousePointerSquareDashed, UserPlus2 } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Employee } from './create-employee-form';

const readFileAsText = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

const parseTextFile = (content: string, isCsv: boolean) => {
  const lines = content.split('\n');
  const employees = [];
  const delimiter = isCsv ? ',' : '\t';

  const startIndex =
    lines[0].toLocaleLowerCase().includes('name') ||
    lines[0].toLowerCase().includes('email')
      ? 1
      : 0;

  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;

    const parts = lines[i].split(delimiter);
    if (parts.length >= 2) {
      employees.push({
        id: crypto.randomUUID(),
        fullName: parts[0].trim(),
        email: parts[1].trim(),
        roleId: '',
      });
    }
  }

  return employees;
};

const parseExcelFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async e => {
      try {
        const buffer = e.target?.result;
        const workbook = new ExcelJS.Workbook();
        // @ts-expect-error Trying to fix this buffer typescript error
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          throw new Error('Excel file has no worksheets');
        }

        const employees: Employee[] = [];
        let headerRow = true;
        let nameColIndex = 0;
        let emailColIndex = 1;

        // Process each row
        worksheet.eachRow(row => {
          if (headerRow) {
            row.eachCell((cell, colNumber) => {
              const value = cell.value?.toString().toLowerCase() || '';
              if (value.includes('name')) nameColIndex = colNumber - 1;
              if (value.includes('email')) emailColIndex = colNumber - 1;
            });

            headerRow = false;
            return;
          }

          const rowValues: string[] = [];
          row.eachCell(cell => {
            rowValues.push(cell.value?.toString() || '');
          });

          if (rowValues.length > Math.max(nameColIndex, emailColIndex)) {
            employees.push({
              id: crypto.randomUUID(),
              fullName: rowValues[nameColIndex]?.trim() || '',
              email: rowValues[emailColIndex]?.trim() || '',
              roleId: '',
            });
          }
        });

        resolve(employees);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

type ImportEmployeesComponentProps = {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
};

const ImportEmployeesComponent = ({
  setDialogOpen,
  setEmployees,
}: ImportEmployeesComponentProps) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processFile = async (file: File) => {
    setIsLoading(true);

    try {
      const fileName = file.name.toLocaleLowerCase();

      if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
        const txt = (await readFileAsText(file)) as string;
        const employees = parseTextFile(txt, fileName.endsWith('.csv'));

        setEmployees(employees);
        setDialogOpen(true);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const employees = (await parseExcelFile(file)) as Employee[];

        setEmployees(employees);
        setDialogOpen(true);
      } else {
        toast.error(`${file.type} type is not supported.`, {
          description: 'Please choose a TXT, CSV, XLSX or XLS file instead.',
        });
      }
    } catch {
      toast.error('Something went wrong', {
        description:
          'We could not process your file. Please try again or try a different format.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);
    toast.error(`${file.file.type} type is not supported.`, {
      description: 'Please choose a TXT, CSV, XLSX or XLS file instead.',
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
      setIsDragOver(false);
    }
  };

  return (
    <Dropzone
      onDropRejected={onDropRejected}
      onDropAccepted={onDropAccepted}
      accept={{
        'text/plain': ['.txt'],
        'text/csv': ['.csv'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
          '.xlsx',
        ],
        'application/vnd.ms-excel': ['.xls'],
      }}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      maxFiles={1}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={cn(
            'w-full h-64 flex flex-col gap-2 items-center justify-center border-2 border-dashed rounded-xl',
            isDragOver
              ? 'bg-amber-100/25 border-amber-300'
              : 'bg-background/25 border-border'
          )}
        >
          <input {...getInputProps()} />
          {isDragOver ? (
            <h6 className='flex items-center gap-1 font-medium'>
              <MousePointerSquareDashed className='size-5 mb-1' />
              Drop your file
            </h6>
          ) : isLoading ? (
            <h6 className='flex items-center gap-1 font-medium'>
              <Loader2 className='size-4 mr-1 animate-spin' />
              Proccessing
            </h6>
          ) : (
            <h6 className='flex items-center gap-1 font-medium'>
              <UserPlus2 className='size-4 mr-1' />
              Import Employees
            </h6>
          )}

          <p className='text-xs text-muted-foreground'>TXT, CSV, XLSX, XLS</p>

          <p className='text-sm text-muted-foreground'>
            You can import employees data.{' '}
            <span>
              <Link
                href='/support/tutorials'
                className='underline'
                onClick={e => e.stopPropagation()}
              >
                See how to do it.
              </Link>
            </span>
          </p>
        </div>
      )}
    </Dropzone>
  );
};

export default ImportEmployeesComponent;
