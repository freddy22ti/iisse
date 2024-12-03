import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { VisualisasiGroupChart } from '@/Components/graph/VisualisasiGroupChart';


export default function Visualisasi(
    {
        data,
    }: {
        data: any[]
    }) {
    const LIST_KATEGORI: Record<string, string> = {
        Demography: 'demografi',
        PM25: 'pm25',
        Economic: 'ekonomi',
        Health: 'kesehatan',
        Social: 'sosial',
    };
    // Ambil nama tabel dari URL
    const url = usePage().url;

    // Ambil bagian query dari URL
    const extractedParams = url.split("/");

    // fungsi untuk mencari kate    gori default yang dipilih
    const defaultKategori = (): string => {
        if (extractedParams.length === 3) {
            const keyFromValue = Object.keys(LIST_KATEGORI)
                .find(k => LIST_KATEGORI[k] === extractedParams[2]);
            return keyFromValue || "";
        } else {
            return 'Demography';
        }
    }

    // Default kategori aktif adalah tab pertama
    const [kategori, setKategori] = useState<string>(defaultKategori());
    const [activeState, setActiveState] = useState<string>('temporary');


    const handleKategoriChange = (newKategori: string) => {
        setKategori(newKategori);
        const mappedValue = LIST_KATEGORI[newKategori]
        router.get(
            route('visualisasi.kategori', mappedValue)
        );
    }

    // Default status adalah temporary
    const handleStateChange = (state: string) => {
        setActiveState(state);
    }


    return (
        <AuthenticatedLayout>
            <Head title="Visualisasi" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Kategori */}
                    <div className="flex mb-10 justify-between">
                        {Object.keys(LIST_KATEGORI).map((item, index) => (
                            <Button
                                key={index}
                                variant={kategori === item ? 'default' : 'secondary'} // Tentukan variant berdasarkan tab aktif
                                onClick={() => handleKategoriChange(item)} // Ganti tab ketika diklik
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                    {/* End Kategori */}

                    {/* Type */}
                    <div className="flex space-x-8 mb-5">
                        <Button
                            variant={activeState === 'temporary' ? 'default' : 'outline'}
                            className="px-8"
                            onClick={() => handleStateChange('temporary')}
                        >
                            Temporary
                        </Button>
                        <Button
                            variant={activeState === 'spatial' ? 'default' : 'outline'}
                            className="px-8"
                            onClick={() => handleStateChange('spatial')}
                        >
                            Spatial
                        </Button>
                    </div>
                    {/* End Type */}

                    {/* chart with filter */}
                    {Object.entries(data).map(([key, value]) => (
                        <VisualisasiGroupChart
                            key={key}
                            title={key}
                            activeState={activeState}
                            data={value}
                        />
                    ))}
                    {/* end chart with filter */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

