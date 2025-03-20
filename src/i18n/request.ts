import { getRequestConfig } from 'next-intl/server';

import { getAuthUser } from '@/access-data/user/get-auth-user';
import { LOCALE_DICTIONARY } from '@/lib/dictionaries';

export default getRequestConfig(async () => {
  const user = await getAuthUser();
  const locale = LOCALE_DICTIONARY[user.locale];

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
