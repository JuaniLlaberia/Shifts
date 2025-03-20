import { z } from 'zod';

export const createDepartmentValidator = z.object({
  name: z.string().min(1, { message: 'Department name is required' }),
  description: z.optional(z.string()),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const updateDepartmentValidator = z.object({
  departmentId: z.string().cuid({ message: 'Invalid department id' }),
  name: z.optional(
    z.string().min(1, { message: 'Department name is required' })
  ),
  description: z.optional(z.string()),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const deleteDepartmentValidator = z.object({
  departmentId: z.string().cuid({ message: 'Invalid department id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
