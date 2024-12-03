import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Label,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { YearSelector } from "@/Components/selectors/YearSelector";
import { sumValueAndGroup } from "@/lib/processData";
import { colors } from "@/const";
import { filterDataByYearAndTerritory, getLatestYear } from "@/lib/utils";
import { GeneralDataProps } from "@/types";

interface DiseaseData {
    kecamatan: string;
    jenis_penyakit: string;
    jumlah_kasus: number;
    tahun: string;
}

export const DiseaseDevelopment = (
    {
        data,
        globalYear,
        globalTerritory
    }: {
        data: GeneralDataProps
        globalYear: string;
        globalTerritory: string
    }) => {

    // tahun default adalah tahun terbaru dari data
    const [selectedYear, setSelectedYear] = useState<string>("");

    const [chartData, setChartData] = useState<any[]>([]);
    const [diseaseTypes, setDiseaseTypes] = useState<string[]>([]);


    useEffect(() => {
        if (data.listYears.length > 0) {
            getLatestYear(data.listYears)
        }
    }, [])


    // update year dengan nilai global
    useEffect(() => {
        if (globalYear) setSelectedYear(globalYear);
    }, [globalYear])


    // olah data supaya bisa ditampilkan dengan filter
    useEffect(() => {
        // filter data berdasarkan tahun dan kecamatan
        const filteredData = filterDataByYearAndTerritory(data.data, selectedYear, globalTerritory);

        // hitung jumlah kasus berdasarkan kecamatan dan jenis penyakit
        const { formattedData, uniqueVariable } = sumValueAndGroup(
            filteredData,
            'kecamatan',
            'jenis_penyakit',
            'jumlah_kasus',
            'Pekanbaru'
        );
        console.log(formattedData)

        setChartData(formattedData)
        setDiseaseTypes(uniqueVariable)
    }, [data.data, selectedYear, globalTerritory])


    const handleYearChange = (newYear: string | null) => {
        if (newYear) setSelectedYear(newYear);
    }


    const renderDiseaseChart = () => {
        return diseaseTypes.map((jenisPenyakit, index) => (
            <Bar
                key={jenisPenyakit as string}
                dataKey={jenisPenyakit as string}
                stackId="a"
                fill={colors[index % colors.length]} // Use random color from the array
            />
        ))
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <CardTitle>Disease Development</CardTitle>
                <div className="ms-auto flex items-center">
                    <YearSelector
                        listYears={data.listYears}
                        selectedYear={selectedYear}
                        handleYearChange={handleYearChange}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            bottom: 50,
                            left: 20,
                            right: 10,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="10 10" />
                        <XAxis
                            dataKey="kecamatan"
                            angle={-45}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                            interval={0} // Mengatur interval menjadi 0 untuk menampilkan semua label
                        />
                        <YAxis>
                            <Label
                            value="Jumlah Kasus"
                            angle={0}
                            position="top"
                            offset={30} />
                        </YAxis>
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        {renderDiseaseChart()}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card >
    );
};
