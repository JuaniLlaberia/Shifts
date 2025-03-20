import { Permissions } from '@prisma/client';
import { z } from 'zod';

export const createRoleValidator = z.object({
  name: z
    .string()
    .min(1, { message: 'Must provide a role name' })
    .max(25, { message: 'Role must have less than 25 charc.' }),
  color: z.string(),
  permissions: z.nativeEnum(Permissions),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  departmentId: z.string().cuid({ message: 'Invalid department id' }),
});

export const updateRoleValidator = z.object({
  roleId: z.string().cuid({ message: 'Invalid role id' }),
  name: z.optional(
    z
      .string()
      .min(1, { message: 'Must provide a role name' })
      .max(25, { message: 'Role must have less than 25 charc.' })
  ),
  color: z.optional(z.string()),
  permissions: z.optional(z.nativeEnum(Permissions)),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  departmentId: z.string().cuid({ message: 'Invalid department id' }),
});

export const deleteRoleValidator = z.object({
  roleId: z.string().cuid({ message: 'Invalid role id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
