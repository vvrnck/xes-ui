'use client'

import { useTranslations } from 'next-intl';
import FormConverter from '@/_forms/converter/FormConverter';

export default function Home() {
    const t = useTranslations();

    return (
        <section className="flex flex-col items-center p-5 sm:p-24 xl:mx-20">
			<h1 className="text-2xl font-semibold mb-4">{t('xes_title')}</h1>
			<div className='flex flex-col gap-2 w-full sm:w-2/3 justify-center items-center'>
                <FormConverter />
			</div>
        </section>
    )
}
