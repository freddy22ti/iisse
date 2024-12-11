import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { YearSelector } from '@/Components/selectors/YearSelector';
import { TerritorySelector } from '@/Components/selectors/TerritorySelector';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

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
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const [correlationData, setCorrelationData] = useState<{ [key: string]: number }>({});

    const handleYearChange = (selectedYear: string | null) => {
        if (selectedYear) setYear(selectedYear);
    }

    

    const handleTableSelect = (table: string) => {
        setSelectedTables(prevSelected => {
            if (prevSelected.includes(table)) {
                return prevSelected.filter(t => t !== table);
            } else if (prevSelected.length < 2) {
                return [...prevSelected, table];
            }
            return prevSelected; // Limit to max 2 selections
        });
    };

    useEffect(() => {
        // Cek jika ada parameter
        if (extractedParams) {
            const urlParams = new URLSearchParams(extractedParams);

            // Mengambil nilai parameter
            const yearFromUrl = urlParams.get("year") || "";
            const table1 = urlParams.get("table1") || "";
            const table2 = urlParams.get("table2") || "";

            // Set state with extracted values
            setYear(yearFromUrl);
            if (table1) {
                setSelectedTables(prev => [...prev, table1]);
            }
            if (table2) {
                setSelectedTables(prev => [...prev, table2]);
            }
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

    const fetchCorrelation = () => {
        if (selectedTables.length === 2) {
            const params: {
                table1: string;
                table2: string;
                year?: string;         // Optional
                territory?: string;     // Optional
            } = {
                table1: selectedTables[0],
                table2: selectedTables[1],
            };

            if (year) params.year = year;
            router.get(route('korelasi'), params)
        }
    }

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
                            <div className="me-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-[150px] justify-between"
                                        >
                                            Variable
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {listTables.map((table) => (
                                            <DropdownMenuItem
                                                key={table}
                                                onClick={() => handleTableSelect(table)}
                                            >
                                                {selectedTables.includes(table) && " ✔️"} {/* Indicate selected tables */}
                                                {table}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="ms-auto">
                                <Button onClick={fetchCorrelation} disabled={selectedTables.length !== 2}>
                                    Fetch Correlation
                                </Button>
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
    // Create a list of unique variables from the correlation data
    const variables = [
        ...new Set(
            Object.keys(correlation)
                .map(key => key.split(' vs ')[0])
                .concat(Object.keys(correlation).map(key => key.split(' vs ')[1]))
        ),
    ];

    // Create a matrix for the heatmap
    const matrix = variables.map((rowVar) =>
        variables.map((colVar) => {
            const key = `${rowVar} vs ${colVar}`;
            // Set self-correlation to 1 (strong correlation)
            if (rowVar === colVar) {
                return 1; // Self-correlation
            }
            return correlation[key] !== undefined ? correlation[key] : null; // Get correlation value or null
        })
    );

    const getColor = (value: number | null) => {
        if (value === null) return '#ffffff'; // White for no value
        const clampedValue = Math.max(0, Math.min(1, value)); // Clamp value between 0 and 1
        const red = Math.floor(255 * (1 - clampedValue));
        const green = Math.floor(255 * clampedValue);
        return `rgb(${red}, ${green}, 0)`; // Color from red to green
    };

    return (
        <div className="overflow-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 bg-gray-100">Variable</th>
                        {variables.map((variable) => (
                            <th key={variable} className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 bg-gray-100">
                                {variable}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={variables[rowIndex]}>
                            <td className="border border-gray-300 p-2 text-sm font-medium text-gray-700 bg-gray-50">
                                {variables[rowIndex]}
                            </td>
                            {row.map((value, colIndex) => (
                                <td
                                    key={`${rowIndex}-${colIndex}`}
                                    className="border border-gray-300 p-2 text-center text-sm"
                                    style={{
                                        backgroundColor: getColor(value),
                                        color: value !== null && value > 0.5 ? 'white' : 'black',

                                    }}
                                >
                                    {value !== null ? value.toFixed(2) : '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
