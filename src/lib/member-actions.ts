import { z } from 'zod';

import { db } from '@/db';
import { authenticatedAction } from './safe-actions';

type ActionHandler<TInput, TOutput> = (args: {
  input: TInput;
  ctx: { userId: string; employeeId: string };
}) => Promise<TOutput>;

type ZodValidator<T> = z.ZodType<T>;

// Factory function for member-protected actions
export const createMemberServerAction = () => {
  const baseAction = authenticatedAction.createServerAction();

  return {
    input<TInput extends { businessId: string }>(
      validator: ZodValidator<TInput>
    ) {
      const validatedAction = baseAction.input(validator);

      return {
        handler<TOutput>(userHandler: ActionHandler<TInput, TOutput>) {
          return validatedAction.handler(async ({ input, ctx }) => {
            const { userId } = ctx;
            const { businessId } = input as TInput;

            const employee = await db.employee.findUnique({
              where: {
                businessId_userId: {
                  businessId,
                  userId,
                },
              },
              select: { id: true },
            });

            if (!employee)
              throw new Error('You are not a member of this business');

            const extendedCtx = {
              ...ctx,
              employeeId: employee.id,
            };

            return userHandler({
              input: input as TInput,
              ctx: extendedCtx,
            });
          });
        },
      };
    },
  };
};

export const memberAction = {
  createServerAction: createMemberServerAction,
};
