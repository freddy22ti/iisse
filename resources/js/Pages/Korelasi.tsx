import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { YearSelector } from '@/Components/selectors/YearSelector';
import { TerritorySelector } from '@/Components/selectors/TerritorySelector';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"

import { CaretSortIcon } from '@radix-ui/react-icons';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import { formatColumnName } from '@/lib/utils';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/Components/ui/hover-card';
import { CORR_MSG } from '@/const';
import { ScrollArea } from '@/Components/ui/scroll-area';

// Define the structure for a single entry in dataJawaban
interface DataJawabanItem {
    kecamatan: string;
    nilai_pm25: number;
    frekuensi_pakai_masker: number;
    aksi_saat_udara_buruk: number;
    intensitas_penggunaan_masker_kabut_asap: number;
    penggunaan_air_purifier: number;
    frekuensi_konsultasi_dokter: number;
    kondisi_ventilasi: number;
    kualitas_udara_pengaruhi_pendapatan: number;
    absen_kerja_sekolah: number;
    dampak_usaha_kualitas_udara: number;
    usaha_berjalan_normal_saat_kabut: number;
    gangguan_kesehatan_pribadi: number;
    gangguan_kesehatan_keluarga: number;
}

interface AveragesByKecamatan {
    [kecamatan: string]: {
        nilai_pm25: number; // Include pm2.5 value
        awareness: number;
        economy: number;
        health: number;
    };
}

export default function Korelasi({
    listTables,
    listYears,
    data,
    dataJawaban,
}: {
    listTables: string[]
    listYears: string[]
    listTerritories: string[]
    data: { [key: string]: number }
    dataJawaban?: any; // Tambahkan jika opsiona

}) {
    // Ambil nama tabel dari URL
    const url = usePage().url;

    const { errors } = usePage().props;

    // Ambil bagian query dari URL
    const extractedParams = url.split("?")[1];

    const [year, setYear] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const [correlationData, setCorrelationData] = useState<{ [key: string]: number }>({});

    const handleYearChange = (selectedYear: string | null) => {
        if (selectedYear) {
            const params = {
                year: selectedYear
            }
            router.get(route('korelasi'), params)
            // setYear(selectedYear)
        }
    }

    useEffect(() => {
        // Cek jika ada parameter
        if (extractedParams) {
            const urlParams = new URLSearchParams(extractedParams);

            // Mengambil nilai parameter
            const yearFromUrl = urlParams.get("year") || "";

            // Set state with extracted values
            setYear(yearFromUrl);
        }
    }, [extractedParams]); // Only run this effect if extractedParams changes

    // set data jika ada nilai
    useEffect(() => {
        if (data) setCorrelationData(data)
    }, [data])

    useEffect(() => {
        if (errors) setErrorMsg(errors.error)
    }, [errors])

    useEffect(() => {
        if (errorMsg) {
            toast.error(errorMsg)
            setErrorMsg("")
        }
    }, [errors, errorMsg])


    return (
        <AuthenticatedLayout>
            <Head title="Korelasi" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="min-h-[75lvh] p-6 bg-white rounded-md">
                        {/* Filter */}
                        <div className="flex mb-6">
                            <div className="me-4">
                                <YearSelector
                                    selectedYear={year}
                                    listYears={listYears}
                                    handleYearChange={handleYearChange}
                                />
                            </div>
                        </div>

                        {/* Heatmap */}
                        <Heatmap correlation={correlationData} dataJawaban={dataJawaban} />
                        {/* End Heatmap */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Heatmap = ({ correlation, dataJawaban }: { correlation: { [key: string]: number }, dataJawaban: { [key: string]: any } }) => {
    // Create a list of unique variables from the correlation data, considering both directions
    const variables = [
        ...new Set(
            Object.keys(correlation)
                .flatMap(key => {
                    const [var1, var2] = key.split(' vs ');
                    return [var1, var2, var2, var1];  // Include both directions: A vs B and B vs A
                })
        ),
    ];

    const correlationWithPM25 = {
        'nilai_pm25': correlation["nilai_pm25 vs nilai_pm25"] || 1.0,
        'Kesehatan': correlation["nilai_pm25 vs Kesehatan"] || correlation["Kesehatan vs nilai_pm25"] || 0,
        'Awareness': correlation["nilai_pm25 vs Awareness"] || correlation["Awareness vs nilai_pm25"] || 0,
        'Ekonomi': correlation["nilai_pm25 vs Ekonomi"] || correlation["Ekonomi vs nilai_pm25"] || 0,
    };

    const sortedCorrelation = Object.entries(correlationWithPM25)
        .sort((a, b) => b[1] - a[1]);

    // Create a matrix for the heatmap
    const matrix = variables.map((rowVar) =>
        variables.map((colVar) => {
            const key1 = `${rowVar} vs ${colVar}`;
            const key2 = `${colVar} vs ${rowVar}`;
            // Set self-correlation to 1 (strong correlation)
            if (rowVar === colVar) {
                return 1; // Self-correlation
            }
            // Try to get the correlation from both directions
            return correlation[key1] !== undefined ? correlation[key1] : (correlation[key2] !== undefined ? correlation[key2] : null);
        })
    );
    const coolwarmColors = [
        "#5977e3", // Biru gelap (nilai rendah)
        "#7b9ff9",
        "#9ebeff",
        "#c0d4f5",
        "#dddcdc",
        "#f2cbb7",
        "#f7ac8e",
        "#ee8468",
        "#d65244"  // Merah gelap (nilai tinggi)
    ];

    // Helper function to interpolate between two colors
    type Color = string;

    function interpolateColor(color1: Color, color2: Color, factor: number): string {
        const c1 = parseInt(color1.slice(1), 16);
        const c2 = parseInt(color2.slice(1), 16);

        const r1 = (c1 >> 16) & 0xff;
        const g1 = (c1 >> 8) & 0xff;
        const b1 = c1 & 0xff;

        const r2 = (c2 >> 16) & 0xff;
        const g2 = (c2 >> 8) & 0xff;
        const b2 = c2 & 0xff;

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    // Function to get the interpolated color based on the value
    const getColor = (value: number): string => {
        // Normalize value to the range [0, 1]
        const normalizedValue = (value + 1) / 2; // Map [-1, 1] to [0, 1]

        // Determine the segment where the value falls
        const segment = Math.floor(normalizedValue * (coolwarmColors.length - 1));
        const segmentFraction = normalizedValue * (coolwarmColors.length - 1) - segment;

        // Get the interpolated color between the two segment colors
        const color1 = coolwarmColors[segment];
        const color2 = coolwarmColors[Math.min(segment + 1, coolwarmColors.length - 1)];

        return interpolateColor(color1, color2, segmentFraction);
    };

    const hoverCardMessage = (corr_point: number, category: string) => {
        // Find the relevant category
        const selectedCategory = CORR_MSG.find((msg) => msg.title === category);
        if (!selectedCategory) return null;

        // Find the matching condition
        const conditionIndex = selectedCategory.conditions.findIndex(
            (cond) => corr_point >= cond.range[0] && corr_point <= cond.range[1]
        );
        if (conditionIndex === -1) return null;

        const condition = selectedCategory.conditions[conditionIndex];

        // Define color classes dynamically
        const colors = [
            'text-red-500',    // Color for the first condition
            'text-red-300',    // Color for the second condition
            'text-gray-500',   // Color for the third condition
            'text-green-400',  // Color for the fourth condition
            'text-green-600',  // Color for the fifth condition
        ];
        // Safely get the color or fallback to a default
        const textColor = colors[conditionIndex] || 'text-black';

        // Render the result
        return (
            <HoverCard>
                <HoverCardTrigger className='w-full flex'>
                    <h3 className='font-bold w-[100px] text-md'>{selectedCategory.title}: </h3>
                    <h3 className={`uppercase ${textColor} text-md`}>{condition.status}</h3>
                </HoverCardTrigger>
                <HoverCardContent className='w-[500px]'>
                    <p className='font-bold mb-2'>{condition.description}</p>
                    <p className='text-justify'>{condition.message}</p>
                </HoverCardContent>
            </HoverCard>
        );
    }


    // Function to calculate category averages by kecamatan
    const calculateCategoryAverages = (dataJawaban: Record<string, DataJawabanItem>): AveragesByKecamatan => {
        // Object to group by kecamatan
        const groupedByKecamatan: Record<
            string,
            { count: number; sums: { awareness: number; economy: number; health: number }; nilai_pm25: number }
        > = {};

        // Group data by kecamatan and accumulate sums
        Object.entries(dataJawaban).forEach(([id, item]) => {
            const kecamatan = item.kecamatan;

            if (!groupedByKecamatan[kecamatan]) {
                groupedByKecamatan[kecamatan] = {
                    count: 0,
                    sums: {
                        awareness: 0,
                        economy: 0,
                        health: 0,
                    },
                    nilai_pm25: item.nilai_pm25 // Use consistent naming
                };
            }

            // Increment the count
            groupedByKecamatan[kecamatan].count += 1;

            // Sum up values for awareness
            groupedByKecamatan[kecamatan].sums.awareness +=
                item.frekuensi_pakai_masker +
                item.aksi_saat_udara_buruk +
                item.intensitas_penggunaan_masker_kabut_asap +
                item.penggunaan_air_purifier +
                item.frekuensi_konsultasi_dokter +
                item.kondisi_ventilasi;

            // Sum up values for economy
            groupedByKecamatan[kecamatan].sums.economy +=
                item.kualitas_udara_pengaruhi_pendapatan +
                item.absen_kerja_sekolah +
                item.dampak_usaha_kualitas_udara +
                item.usaha_berjalan_normal_saat_kabut;

            // Sum up values for health
            groupedByKecamatan[kecamatan].sums.health +=
                item.gangguan_kesehatan_pribadi +
                item.gangguan_kesehatan_keluarga;
        });

        // Calculate averages
        const averagesByKecamatan: AveragesByKecamatan = {};

        for (const kecamatan in groupedByKecamatan) {
            const { count, sums, nilai_pm25 } = groupedByKecamatan[kecamatan];

            averagesByKecamatan[kecamatan] = {
                nilai_pm25, // Include pm2.5 value
                awareness: parseFloat((sums.awareness / count).toFixed(2)), // Rounded average
                economy: parseFloat((sums.economy / count).toFixed(2)),
                health: parseFloat((sums.health / count).toFixed(2))
            };
        }

        return averagesByKecamatan;
    };


    const averagesByKecamatan = useMemo(() => calculateCategoryAverages(dataJawaban), [dataJawaban]);

    return (
        <>
            <div className="overflow-auto flex space-x-8 mb-4">
                <table className="border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 bg-gray-100">Variable</th>
                            {variables.map((variable) => (
                                <th key={variable} className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 bg-gray-100 capitalize">
                                    {formatColumnName(variable)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, rowIndex) => (
                            <tr key={variables[rowIndex]}>
                                <td className=" [h-120px] [w-100px] border border-gray-300 p-2 text-sm font-medium text-gray-700 bg-gray-50 capitalize">
                                    {formatColumnName(variables[rowIndex])}
                                </td>
                                {row.map((value, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        className="[h-120px] [w-100px] border border-gray-300 p-2 text-center text-sm"
                                        style={{
                                            backgroundColor: getColor(value || 0),
                                            color: 'black',
                                            width: '120px', // Sesuaikan lebar sesuai kebutuhan
                                            height: '100px' // Sesuaikan tinggi sesuai lebar

                                        }}
                                    >
                                        {value !== null ? value.toFixed(2) : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="space-y-4">
                    <div className="overflow-auto">
                        <h2 className='font-bold text-xl mb-2'>
                            Paling Berkorelasi
                        </h2>
                        <table className="border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 bg-gray-100">Variable</th>
                                    <th className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 bg-gray-100">Correlation with PM25</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCorrelation.map(([variable, value]) => (
                                    <tr key={variable}>
                                        <td className="border border-gray-300 p-2 text-sm text-gray-700 capitalize">{formatColumnName(variable)}</td>
                                        <td className="border border-gray-300 p-2 text-sm text-gray-700">{value.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="">
                        <h2 className='font-bold text-xl mb-2'>Tingkat Korelasi</h2>
                        <div className="text-lg w-50 space-y-1">
                            <>
                                {hoverCardMessage(correlationWithPM25.Awareness, 'Awareness')}
                                {hoverCardMessage(correlationWithPM25.Ekonomi, 'Economy')}
                                {hoverCardMessage(correlationWithPM25.Kesehatan, 'Health')}
                            </>
                        </div>
                    </div>
                </div>

            </div >

            <div className="space-x-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            Detail
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="min-h-[90vh] min-w-[98lvw]">
                        <DialogHeader>
                            <DialogTitle>Detail pemberian nilai</DialogTitle>
                            <DialogDescription>Jawaban responden yang diberikan bobot untuk setiap pertanyaan yang digunakan.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Table wrapper with scrolling functionality */}
                        <div className="overflow-y-auto max-h-[70vh]"> {/* Add max-height and overflow */}
                            <Table>
                                <TableCaption>Data Jawaban Responden</TableCaption>
                                <TableHeader className='text-center'>
                                    <TableRow>
                                        {/* Header tingkat atas */}
                                        <TableHead rowSpan={2} className='text-center bg-blue-300 text-black'>Nomor</TableHead>
                                        <TableHead rowSpan={2} className='text-center bg-blue-300 text-black'>Waktu</TableHead>
                                        <TableHead rowSpan={2} className='text-center bg-blue-300 text-black'>Kecamatan</TableHead>
                                        <TableHead rowSpan={2} className='text-center bg-indigo-300 text-black'>Nilai PM 25</TableHead>
                                        <TableHead colSpan={6} className='text-center bg-red-400 text-black'>Awareness</TableHead>
                                        <TableHead colSpan={4} className='text-center bg-yellow-400 text-black'>Economy</TableHead>
                                        <TableHead colSpan={2} className='text-center bg-green-500 text-black'>Health</TableHead>

                                    </TableRow>
                                    <TableRow>
                                        {/* Header tingkat bawah untuk "Awareness" */}
                                        <TableHead className='text-center bg-red-300 text-black'>Frekuensi Menggunakan Masker</TableHead>
                                        <TableHead className='text-center bg-red-300 text-black'>Aksi Saat Kondisi Udara Buruk</TableHead>
                                        <TableHead className='text-center bg-red-300 text-black'>Intensitas Menggunakan Masker Ketika Kabut Asap</TableHead>
                                        <TableHead className='text-center bg-red-300 text-black'>Penggunaan Air Purifier di Rumah</TableHead>
                                        <TableHead className='text-center bg-red-300 text-black'>Frekuensi Konsultasi Dokter</TableHead>
                                        <TableHead className='text-center bg-red-300 text-black'>Kondisi Ventilasi Di Rumah</TableHead>
                                        <TableHead className='text-center bg-yellow-300 text-black'>Apakah Kualitas Udara Mempengaruhi Pendapatan</TableHead>
                                        <TableHead className='text-center bg-yellow-300 text-black'>Absen Kerja atau Sekolah Ketika Kabut Asap</TableHead>
                                        <TableHead className='text-center bg-yellow-300 text-black'>Apakah Kualitas Udara Berdampak pada Usaha?</TableHead>
                                        <TableHead className='text-center bg-yellow-300 text-black'>Apakah Usaha Berjalan Normal Saat Kabut?</TableHead>
                                        <TableHead className='text-center bg-green-400 text-black'>Apakah Anda Pernah Mengalami Gangguan Pernapasan?</TableHead>
                                        <TableHead className='text-center bg-green-400 text-black'>Apakah Keluarga Anda Pernah Mengalami Gangguan Pernapasan?</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(dataJawaban || {}).map(([id, item], index) => (
                                        <TableRow key={id}>
                                            <TableCell className='text-center bg-blue-200 text-black'>{index + 1}</TableCell>
                                            <TableCell className='text-center bg-blue-200 text-black'>{item.waktu}</TableCell>
                                            <TableCell className='text-center bg-blue-200 text-black'>{item.kecamatan}</TableCell>
                                            <TableCell className='text-center bg-indigo-200 text-black'>{item.nilai_pm25}</TableCell>
                                            <TableCell className='text-center bg-red-200 text-black'>{item.frekuensi_pakai_masker}</TableCell>
                                            <TableCell className='text-center bg-red-200 text-black'>{item.aksi_saat_udara_buruk}</TableCell>
                                            <TableCell className='text-center bg-red-200 text-black'>{item.intensitas_penggunaan_masker_kabut_asap}</TableCell>
                                            <TableCell className='text-center bg-red-200 text-black'>{item.penggunaan_air_purifier}</TableCell>
                                            <TableCell className='text-center bg-red-200 text-black'>{item.frekuensi_konsultasi_dokter}</TableCell>
                                            <TableCell className='text-center bg-red-200 text-black'>{item.kondisi_ventilasi}</TableCell>
                                            <TableCell className='text-center bg-yellow-200 text-black'>{item.kualitas_udara_pengaruhi_pendapatan}</TableCell>
                                            <TableCell className='text-center bg-yellow-200 text-black'>{item.absen_kerja_sekolah}</TableCell>
                                            <TableCell className='text-center bg-yellow-200 text-black'>{item.dampak_usaha_kualitas_udara}</TableCell>
                                            <TableCell className='text-center bg-yellow-200 text-black'>{item.usaha_berjalan_normal_saat_kabut}</TableCell>
                                            <TableCell className='text-center bg-green-300 text-black'>{item.gangguan_kesehatan_pribadi}</TableCell>
                                            <TableCell className='text-center bg-green-300 text-black'>{item.gangguan_kesehatan_keluarga}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            Summary
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='min-h-[50vh] min-w-[50vw]'>
                        <DialogHeader>
                            <DialogTitle>Summary korelasi PM2.5</DialogTitle>
                            <DialogDescription>

                            </DialogDescription>

                            <Table>
                                <TableCaption></TableCaption>
                                <TableHeader>
                                    <TableRow className='capitalize'>
                                        <TableHead className='text-center bg-blue-300 text-black'>Kecamatan</TableHead>
                                        <TableHead className='text-center bg-indigo-300 text-black'>PM2.5</TableHead>
                                        <TableHead className='text-center bg-red-300 text-black'>Awareness</TableHead>
                                        <TableHead className='text-center bg-yellow-400 text-black'>Economy</TableHead>
                                        <TableHead className='text-center bg-green-500 text-black'>Health</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(averagesByKecamatan).map(([kecamatan, averages]) => (
                                        <TableRow>
                                            <TableCell className="text-center text-black bg-blue-200">{kecamatan}</TableCell>
                                            <TableCell className="text-center text-black bg-indigo-200">{averages.nilai_pm25}</TableCell>
                                            <TableCell className="text-center text-black bg-red-200">{averages.awareness}</TableCell>
                                            <TableCell className="text-center text-black bg-yellow-200">{averages.economy}</TableCell>
                                            <TableCell className="text-center text-black bg-green-300">{averages.health}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

        </>

    )
}