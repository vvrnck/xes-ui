//"use client"; // keep track of issue https://github.com/vercel/next.js/issues/48879 causing a flick on components

import '../../styles/globals.css';
import { Inter } from 'next/font/google'
import { Locale, getMessages, i18n } from '../../libs/i18n/i18n-config';
import App from '../../components/app/App';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Footer from '../../components/footer/Footer';

const APP_NAME = "XES Converter";
const APP_DESCRIPTION = "This is a XES Converter Application";

export const metadata : Metadata = {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    applicationName: APP_NAME,
    appleWebApp: {
        capable: true,
        title: APP_NAME,
        statusBarStyle: "default",
    },
    formatDetection: {
        telephone: false,
    },
    //themeColor: "#FFFFFF",
    //viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
    manifest: "/manifest.json",
    keywords: ["xes", "xes converter"],
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children, params: { locale } }: { children: React.ReactNode, params: { locale: string } }) {

    let messages;
    try {
        messages = await getMessages(locale as Locale);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning={true}>
            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <App>
                        {children}
                        <Footer />
                    </App>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
