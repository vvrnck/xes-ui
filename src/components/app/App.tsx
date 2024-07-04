"use client";

import useTheme from '@/hooks/useTheme';
import { PropsWithChildren } from 'react';
import { Toaster } from '../ui/sonner';
import { LoadingProvider } from '@/context/loading';

export default function App({ children } : PropsWithChildren) {
    const { ThemeProvider } = useTheme();

    const app = (
        <>
            <ThemeProvider attribute="class" enableSystem={true} defaultTheme='light'>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
                <Toaster position='bottom-left' />
            </ThemeProvider>
        </>
    );

    return app;
}