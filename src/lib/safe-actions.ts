import { createServerActionProcedure } from 'zsa';
import { getAuthUser } from '@/access-data/user/get-auth-user';

export const authenticatedAction = createServerActionProcedure().handler(
  async () => {
    const { id: userId } = await getAuthUser();

    return { userId };
  }
);
