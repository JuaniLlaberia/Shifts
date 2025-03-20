import { z } from 'zod';

import { checkIsAdmin } from '@/actions/helper/check-is-admin';
import { authenticatedAction } from './safe-actions';

type ActionHandler<TInput, TOutput> = (args: {
  input: TInput;
  ctx: { userId: string };
}) => Promise<TOutput>;

type ZodValidator<T> = z.ZodType<T>;

// Factory function for protected actions
export const createProtectedServerAction = () => {
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

            // Perform the admin check
            const isAdmin = await checkIsAdmin({ businessId, userId });
            if (!isAdmin) throw new Error('You must be a business admin');

            return userHandler({ input: input as TInput, ctx });
          });
        },
      };
    },
  };
};

// Export a convenient instance
export const protectedAction = {
  createServerAction: createProtectedServerAction,
};
