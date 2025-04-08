'use client';

import { ReactNode, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import InputWrapper from '@/components/ui/input-wrapper';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { createEmployees as createEmployeesAction } from '@/actions/employee/create-employee';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Employee = {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
};

type CreateEmployeeFormProps = {
  businessId: string;
  roles: {
    id: string;
    name: string;
  }[];
  children?: ReactNode;
};

const CreateEmployeeForm = ({
  children,
  roles,
  businessId,
}: CreateEmployeeFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: crypto.randomUUID(), fullName: '', email: '', roleId: '' },
  ]);

  const addEmployee = () => {
    setEmployees([
      ...employees,
      { id: crypto.randomUUID(), fullName: '', email: '', roleId: '' },
    ]);
  };

  const removeEmployee = (id: string) => {
    if (employees.length === 1) return;
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  const updateEmployee = (
    id: string,
    field: keyof Omit<Employee, 'id'>,
    value: string
  ) => {
    setEmployees(
      employees.map(employee =>
        employee.id === id ? { ...employee, [field]: value } : employee
      )
    );
  };

  const { mutate: createEmployees, isPending } = useServerActionMutation(
    createEmployeesAction,
    {
      mutationKey: ['create-employees'],
      onSuccess: () => {
        toast.success('Employees created successfully');
        setIsOpen(false);
        setEmployees([
          { id: crypto.randomUUID(), fullName: '', email: '', roleId: '' },
        ]);
      },
      onError: () =>
        toast.error('Failed to create employees', {
          description: 'Check the information or try again later.',
        }),
    }
  );

  const handleSubmit = () => {
    const formattedEmployees = employees.map(({ fullName, email, roleId }) => ({
      fullName,
      email,
      roleId,
    }));

    createEmployees({ businessId, employees: formattedEmployees });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmployees([
        { id: crypto.randomUUID(), fullName: '', email: '', roleId: '' },
      ]);
    }
    setIsOpen(open);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children || <Button>Open</Button>}</DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full max-w-4xl space-y-4'>
          <DrawerHeader className='px-0'>
            <DrawerTitle className='text-xl'>Create New Employees</DrawerTitle>
            <DrawerDescription className='max-w-lg text-base'>
              Add all needed information about each employee. They will receive
              an invitation and an email to be able to join your business.
            </DrawerDescription>
          </DrawerHeader>

          <ul className='space-y-4'>
            {employees.map((employee, index) => (
              <li key={employee.id} className='flex items-end gap-2'>
                <InputWrapper
                  inputId={`fullName-${employee.id}`}
                  label={index === 0 ? 'Full name' : ''}
                >
                  <Input
                    id={`fullName-${employee.id}`}
                    value={employee.fullName}
                    onChange={e =>
                      updateEmployee(employee.id, 'fullName', e.target.value)
                    }
                    placeholder='Full name'
                    disabled={isPending}
                  />
                </InputWrapper>

                <InputWrapper
                  inputId={`email-${employee.id}`}
                  label={index === 0 ? 'Email address' : ''}
                >
                  <Input
                    id={`email-${employee.id}`}
                    value={employee.email}
                    onChange={e =>
                      updateEmployee(employee.id, 'email', e.target.value)
                    }
                    placeholder='Email address'
                    type='email'
                    disabled={isPending}
                  />
                </InputWrapper>

                <InputWrapper label={index === 0 ? 'Position' : ''}>
                  <Select
                    value={employee.roleId}
                    onValueChange={val =>
                      updateEmployee(employee.id, 'roleId', val)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Employee position' />
                    </SelectTrigger>
                    <SelectContent className='z-[100]'>
                      {roles.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputWrapper>

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-9 rounded-lg hover:text-red-500'
                  onClick={() => removeEmployee(employee.id)}
                  disabled={employees.length === 1 || isPending}
                >
                  <Trash2 size={18} />
                </Button>
              </li>
            ))}

            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addEmployee}
              className='flex items-center gap-1'
              disabled={isPending}
            >
              <Plus size={16} />
              Add another employee
            </Button>
          </ul>

          <DrawerFooter className='flex flex-row justify-end items-center px-0'>
            <DrawerClose asChild>
              <Button size='sm' variant='outline' disabled={isPending}>
                Cancel
              </Button>
            </DrawerClose>
            <Button
              size='sm'
              onClick={handleSubmit}
              disabled={
                employees.some(e => !e.fullName || !e.email || !e.roleId) ||
                isPending
              }
            >
              Create{' '}
              {employees.length > 1
                ? `${employees.length} employees`
                : 'employee'}
              {isPending && <Loader2 className='size-4 ml-1 animate-spin' />}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateEmployeeForm;
