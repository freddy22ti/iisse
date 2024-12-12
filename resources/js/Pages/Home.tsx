import { Head, usePage } from '@inertiajs/react';
import { GeneralDataProps, PM25DataProps, PM25SummaryProps, PageProps } from '@/types/index';
import { DashboardComponent } from '@/Components/DashboardComponent';


export default function Home(
    {
        listYears,
        listTerritories,
        ekonomiData,
        penyakitData,
        pm25Data,
        sosialData,

        wargaData,
        demografiData,
    }: {
        listYears: string[]
        listTerritories: string[]
        ekonomiData: GeneralDataProps
        penyakitData: GeneralDataProps
        pm25Data: GeneralDataProps
        sosialData: GeneralDataProps
        wargaData: GeneralDataProps
        demografiData: GeneralDataProps
    }) {
    const { appName } = usePage<PageProps>().props;


    return (
        <>
            <Head title="Dashboard" />
            <nav className="border-b border-gray-100 bg-primary shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-20 w-full justify-center font-bold text-xl">
                        {appName}
                    </div>
                </div>
            </nav>
            <div className="py-8 px-6">
                <DashboardComponent
                    listTerritories={listTerritories}
                    listYears={listYears}
                    ekonomiData={ekonomiData}
                    penyakitData={penyakitData}
                    pm25Data={pm25Data}
                    sosialData={sosialData}
                    wargaData={wargaData}
                    demografiData={demografiData} />
            </div>
        </>
    )
}
