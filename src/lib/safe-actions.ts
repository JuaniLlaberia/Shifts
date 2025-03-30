import { createServerActionProcedure } from 'zsa';
import { getAuthUser } from '@/access-data/user/get-auth-user';

export const authenticatedAction = createServerActionProcedure().handler(
  async () => {
    const user = await getAuthUser();
    if (!user) throw new Error('Must be logged in');

    return { userId: user.id };
  }
);
