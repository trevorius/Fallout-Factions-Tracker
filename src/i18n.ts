import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'fr'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const typedLocale = locale as Locale;
  if (!locales.includes(typedLocale)) notFound();

  return {
    locale: typedLocale,
    messages: (await import(`./messages/${typedLocale}.json`)).default
  };
});