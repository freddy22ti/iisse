import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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

export default function Korelasi({
    listTables,
    listYears,
    data,
}: {
    listTables: string[]
    listYears: string[]
    listTerritories: string[]
    data: { [key: string]: number }
    
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
                        <Heatmap correlation={correlationData} />
                        {/* End Heatmap */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Heatmap = ({ correlation }: { correlation: { [key: string]: number } }) => {
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
                    <DialogContent className='min-h-[90vh] min-w-[90vw]'>
                        <DialogHeader>
                            <DialogTitle>Detail pemberian nilai</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>

                            <Table>
                                <TableCaption>A list of your recent invoices.</TableCaption>
                                <TableHeader>
                                    <TableRow className='capitalize'>
                                        <TableHead className="">Nomor</TableHead>
                                        <TableHead>Frekunsi menggunakan masker</TableHead>
                                        <TableHead>Aksi Saat Kondisi Udara Buruk</TableHead>
                                        <TableHead className="">Intensitas menggunakan masker ketika kabut asap</TableHead>
                                        <TableHead className="">Penggunaan air purifier di rumah</TableHead>
                                        <TableHead className="">Frekuensi konsultasi dokter</TableHead>
                                        <TableHead className="">Apakah kualitas udara mempengaruhi pendapatan</TableHead>
                                        <TableHead className="">Absen kerja atau sekolah ketika kabut asap</TableHead>
                                        <TableHead className="">Apakah kualitas udara berdampak pada usaha?</TableHead>
                                        <TableHead className="">Apakah usaha berjalan normal saat kabut?</TableHead>
                                        <TableHead className="">Apakah anda pernah mengalami gangguan pernapasan ?</TableHead>
                                        <TableHead className="">Apakah keluarga anda pernah mengalami gangguan pernapasan ?</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className=""></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </DialogHeader>
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
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>

                            <Table>
                                <TableCaption></TableCaption>
                                <TableHeader>
                                    <TableRow className='capitalize'>
                                        <TableHead className="">Kecamatan</TableHead>
                                        <TableHead>PM2.5</TableHead>
                                        <TableHead className="">Awareness</TableHead>
                                        <TableHead className="">Economy</TableHead>
                                        <TableHead className="">Health</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className=""></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

        </>

    );
};
