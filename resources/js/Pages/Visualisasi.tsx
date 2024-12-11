import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { VisualisasiGroupChart } from '@/Components/graph/VisualisasiGroupChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"


export default function Visualisasi(
    {
        data,
    }: {
        data: any[]
    }) {
    const LIST_KATEGORI = [
        'demografi',
        'pm25',
        'ekonomi',
        'kesehatan',
        'sosial'
    ]
    // Ambil nama tabel dari URL
    const url = usePage().url;
    // Ambil bagian query dari URL
    const extractedParams = url.split("/");

    // fungsi untuk mencari kategori default yang dipilih
    const defaultKategori = extractedParams[2] || LIST_KATEGORI[0];

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
                            {LIST_KATEGORI.map((item) => (
                                <TabsTrigger
                                    key={item}
                                    value={item}
                                    onClick={() => handleKategoriChange(item)}
                                    className='capitalize'
                                >
                                    {item}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {LIST_KATEGORI.map((item) => (
                            <TabsContent key={item} value={item}>
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
                                        Spasial
                                    </Button>
                                </div>
                                {kategori === item && (
                                    <div>
                                        {/* Render chart or content based on active tab */}
                                        {Object.entries(data).map(([key, value]) => (
                                            <VisualisasiGroupChart
                                                key={key}
                                                title={key}
                                                activeState={activeState}
                                                data={value}
                                            />
                                        ))}
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
