export const defaultLocale = 'en-US';
export const locales = ['en-US', 'pt-BR', 'es-ES']; 

export const i18n = {
    defaultLocale: defaultLocale,
    locales: locales,
} as const;
  
export type Locale = (typeof i18n)['locales'][number];

export const getMessages = async (locale : Locale) => {
    return {
        ...(await import(`./languages/${locale}/common.json`)).default,
        ...(await import(`./languages/${locale}/form.json`)).default,
        ...(await import(`./languages/${locale}/toast.json`)).default,
    }
}