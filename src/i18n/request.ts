import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  //Get locale from user account settings
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
