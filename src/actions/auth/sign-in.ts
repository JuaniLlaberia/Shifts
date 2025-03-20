'use server';

import { signIn } from '@/auth';

export const signInAction = async (provider: 'google') => {
  await signIn(provider);
};
