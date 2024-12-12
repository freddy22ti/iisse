import { DashboardComponent } from '@/Components/DashboardComponent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GeneralDataProps, PM25DataProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function Dashboard({
    listYears,
    listTerritories,
    ekonomiData,
    penyakitData,
    pm25Data,
    sosialData,

    wargaData,
    demografiData

}: {
    listYears: string[];
    listTerritories: string[];
    ekonomiData: GeneralDataProps;
    penyakitData: GeneralDataProps;
    sosialData: GeneralDataProps;
    pm25Data: GeneralDataProps;

    wargaData: GeneralDataProps
    demografiData: GeneralDataProps

}) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-2">
                    <DashboardComponent
                        listYears={listYears}
                        listTerritories={listTerritories}
                        ekonomiData={ekonomiData}
                        penyakitData={penyakitData}
                        pm25Data={pm25Data}
                        sosialData={sosialData}
                        wargaData={wargaData}
                        demografiData={demografiData}
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
