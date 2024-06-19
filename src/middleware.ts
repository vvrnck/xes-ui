import createMiddleware from 'next-intl/middleware';
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest } from 'next/server'
import { locales, defaultLocale } from './libs/i18n/i18n-config';
import { cookies } from 'next/headers';

const fallbackLocale = defaultLocale;
 
// Get the preferred locale
function getLocale(request : NextRequest) { 
    const acceptLanguage = request.headers.get('accept-language')?.substring(0,5);
    let headers = { 'accept-language': acceptLanguage };
    let languages = new Negotiator({ headers }).languages();
    let defaultLocale = fallbackLocale;
    
    return match(languages, locales, defaultLocale);
}

export default async function middleware(request: NextRequest) {
    // const token = cookies().get("token");
    // if (token) {
    //     api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    // }

    // Step 1: Use the incoming request
    const defaultLocale = request.headers.get('x-default-locale') || fallbackLocale;
   
    // Step 2: Create and call the next-intl middleware
    const handleI18nRouting = createMiddleware({
        locales: locales,
        defaultLocale: getLocale(request),
        localePrefix: 'always' 
    });
    const response = handleI18nRouting(request);
   
    // Step 3: Alter the response
    response.headers.set('x-default-locale', defaultLocale);
   
    return response;
}
 
export const config = {
    matcher: [
        // Skip all internal paths (_next)
        //'/((?!_next).*)',
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
        // Optional: only run on root (/) URL
        // '/'
    ],
}