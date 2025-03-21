import { z } from 'zod';

export const createEmployeeValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  roleId: z.string().cuid({ message: 'Invalid role id' }),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
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
