'server only';

import { getAuthUser } from '../user/get-auth-user';

export const withAuth = <T, R>(
  handler: (args: T & { userId: string }) => Promise<R>
) => {
  return async (args: T): Promise<R> => {
    const user = await getAuthUser();
    if (!user) throw new Error('Must be logged in');

    return handler({ ...args, userId: user.id });
  };
};
