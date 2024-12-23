import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { VisualisasiGroupChart } from '@/Components/graph/VisualisasiGroupChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { VisualisasiWarga } from '@/Components/graph/Visualisasi/VisualisasiWarga';
import { VisualisasiPM25 } from '@/Components/graph/Visualisasi/VisualisasiPM25';
import { VisualisasiKasusPenyakit } from '@/Components/graph/Visualisasi/VisualisasiKasusPenyakit';
import { VisualisasiSaranaPelayananKesehatan } from '@/Components/graph/Visualisasi/VisualisasiSaranaPelayananKesehatan';
import { VisualisasiCuaca } from '@/Components/graph/Visualisasi/VisualisasiCuaca';


export default function Visualisasi(
    {
        data,
    }: {
        data: any[]
    }) {
    const LIST_KATEGORI = {
        'demografi': 'demography',
        'pm25': 'pm25',
        'ekonomi': 'Economy',
        'kesehatan': "Health",
        'sosial': 'Social'
    }
    // Ambil nama tabel dari URL
    const url = usePage().url;
    // Ambil bagian query dari URL
    const extractedParams = url.split("/");

    // fungsi untuk mencari kategori default yang dipilih
    const defaultKategori = extractedParams[2] || Object.keys(LIST_KATEGORI)[0];

    // Default kategori aktif adalah tab pertama
    const [kategori] = useState<string>(defaultKategori)
    const [activeState, setActiveState] = useState<string>('temporal')


    const handleKategoriChange = (newKategori: string) => {
        router.get(
            route('visualisasi.kategori', newKategori)
        );
    }

    const handleStateChange = (state: string) => {
        setActiveState(state);
    }


    return (
        <AuthenticatedLayout>
            <Head title="Visualisasi" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Kategori */}
                    <Tabs defaultValue={kategori} className="w-full">
                        <TabsList className='px-4 py-6 bg-zinc-200'>
                            {Object.entries(LIST_KATEGORI).map(([key, value]) => (
                                <TabsTrigger
                                    key={key}
                                    value={key}
                                    onClick={() => handleKategoriChange(key)}
                                    className="capitalize"
                                >
                                    {value} {/* Show the value of LIST_KATEGORI (display name) */}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {Object.entries(LIST_KATEGORI).map(([key, value]) => (
                            <TabsContent key={key} value={key}>
                                <div className="flex space-x-8 my-5">
                                    <Button
                                        variant={activeState === 'temporal' ? 'default' : 'outline'}
                                        className="px-8"
                                        onClick={() => handleStateChange('temporal')}
                                    >
                                        Temporal
                                    </Button>
                                    <Button
                                        variant={activeState === 'spasial' ? 'default' : 'outline'}
                                        className="px-8"
                                        onClick={() => handleStateChange('spasial')}
                                    >
                                        Spatial
                                    </Button>
                                </div>
                                {kategori === key && (
                                    <div>
                                        {/* Render chart or content based on active tab */}
                                        {Object.entries(data).map(([key, value]) => {

                                            if (key === 'warga') {
                                                return (
                                                    <VisualisasiWarga
                                                        key={key}
                                                        title={key}
                                                        activeState={activeState}
                                                        data={value}
                                                    />
                                                )
                                            }
                                            if (key === 'pm25 kecamatan') {
                                                return (
                                                    <VisualisasiPM25
                                                        key={key}
                                                        title={key}
                                                        activeState={activeState}
                                                        data={value}
                                                    />
                                                )
                                            }

                                            if (key === 'kasus penyakit') {
                                                return (
                                                    <VisualisasiKasusPenyakit
                                                        key={key}
                                                        title={key}
                                                        activeState={activeState}
                                                        data={value}
                                                    />
                                                )
                                            }

                                            if (key === 'sarana pelayanan kesehatan') {
                                                return (
                                                    <VisualisasiSaranaPelayananKesehatan
                                                        key={key}
                                                        title={key}
                                                        activeState={activeState}
                                                        data={value}
                                                    />
                                                )
                                            }
                                            if (key === 'cuaca') {
                                                return (
                                                    <VisualisasiCuaca
                                                        key={key}
                                                        title={key}
                                                        activeState={activeState}
                                                        data={value}
                                                    />
                                                )
                                            }

                                            return (
                                                <VisualisasiGroupChart
                                                    key={key}
                                                    title={key}
                                                    activeState={activeState}
                                                    data={value}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
