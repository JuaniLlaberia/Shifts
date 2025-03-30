import { getRequestConfig } from 'next-intl/server';

import { getAuthUser } from '@/access-data/user/get-auth-user';
import { LOCALE_DICTIONARY } from '@/lib/dictionaries';

export default getRequestConfig(async () => {
  let locale: string;
  const user = await getAuthUser();
  if (!user) {
    locale = LOCALE_DICTIONARY['EN'];
  } else {
    locale = LOCALE_DICTIONARY[user.locale];
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
