import { z } from 'zod';

export const createEmployeesValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  employees: z.array(
    z.object({
      fullName: z.string(),
      email: z.string().email(),
      roleId: z.string().cuid({ message: 'Invalid role id' }),
    })
  ),
});

export const updateEmployeeValidator = z.object({
  employeeId: z.string().cuid({ message: 'Invalid employee id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  roleId: z.string().cuid({ message: 'Invalid role id' }),
});

export const deleteEmployeeValidator = z.object({
  employeeId: z.string().cuid({ message: 'Invalid employee id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
