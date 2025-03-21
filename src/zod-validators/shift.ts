import { ShiftStatus } from '@prisma/client';
import { z } from 'zod';

export const createSingleShiftValidator = z.object({
  name: z.optional(
    z
      .string()
      .min(1, { message: 'Shift name is required' })
      .max(25, { message: 'Shift name must have less than 25 charc.' })
  ),
  note: z.optional(
    z
      .string()
      .max(100, { message: 'Shift note must have less than 100 chrac.' })
  ),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.nativeEnum(ShiftStatus),
  assignedTo: z.string().cuid({ message: 'Invalid employee id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const createMultipleShiftsValidator = z.object({
  shifts: z.array(createSingleShiftValidator).min(1, {
    message: 'At least one shift must be provided',
  }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const updateShiftValidator = z.object({
  shiftId: z.string().cuid({ message: 'Invalid shift id' }),
  name: z.optional(
    z
      .string()
      .min(1, { message: 'Shift name is required' })
      .max(25, { message: 'Shift name must have less than 25 charc.' })
  ),
  note: z.optional(
    z
      .string()
      .max(100, { message: 'Shift note must have less than 100 chrac.' })
  ),
  startTime: z.optional(z.coerce.date()),
  endTime: z.optional(z.coerce.date()),
  status: z.optional(z.nativeEnum(ShiftStatus)),
  assignedTo: z.string().cuid({ message: 'Invalid employee id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const deleteShiftsValidator = z.object({
  shiftsIds: z.array(z.string().cuid({ message: 'Invalid shift id' })),
  employeesIds: z.array(z.string().cuid({ message: 'Invalid employee id' })),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const publishShiftsValidator = z.object({
  shiftsIds: z.array(z.string().cuid({ message: 'Invalid shift id' })),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
