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
    Cell,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

import { GenericSelector } from "@/Components/ui/GenericSelector";
import { PM25DataProps } from "@/types/index";

export const PM25 = ({
    pm25Data
}: {
    pm25Data: PM25DataProps[];
}) => {
    const [chartData, setChartData] = useState<PM25DataProps[]>([]);
    const [listDate, setListDate] = useState<string[]>([]);
    const [date, setDate] = useState("");

    useEffect(() => {
        // Extract unique dates and sort them in ascending order
        const uniqueDates = Array.from(new Set(pm25Data.map((data) => data.tanggal)));

        setListDate(uniqueDates);

        // Set the latest date as the default selected date
        const latestDate = uniqueDates[0];
        setDate(latestDate);

        // Filter data to display only for the latest date initially
        const filteredData = pm25Data.filter((data) => data.tanggal === latestDate);
        setChartData(filteredData);
    }, [pm25Data]);

    const handleDateChange = (selectedDate: string | null) => {
        if(selectedDate) {
            setDate(selectedDate);
            // Filter data based on the selected date
            const filteredData = pm25Data.filter((data) => data.tanggal === selectedDate);
            setChartData(filteredData);
        }
    };

    // Fungsi untuk menghasilkan warna berdasarkan nilai
    const getBarColor = (value: number): string => {
        const safeLimit = 25; // contoh ambang batas aman
        const highLimit = 100; // contoh ambang batas berbahaya

        if (value <= safeLimit) {
            return `rgb(0, ${Math.min(255, (value / safeLimit) * 255)}, 0)`; // Hijau
        } else if (value >= highLimit) {
            return `rgb(${Math.min(255, (value / highLimit) * 255)}, 0, 0)`; // Merah
        } else {
            // Gradasi dari hijau ke merah
            const green = Math.max(0, 255 - ((value - safeLimit) / (highLimit - safeLimit)) * 255);
            const red = Math.min(255, ((value - safeLimit) / (highLimit - safeLimit)) * 255);
            return `rgb(${red}, ${green}, 0)`; // Gradasi
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center">
                <CardTitle>PM2.5</CardTitle>
                <div className="ms-auto flex items-center">
                    <GenericSelector
                        items={listDate}
                        selectedItem={date}
                        onSelectItem={handleDateChange}
                        placeholder="Select Time"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            bottom: 60,
                            left: 20,
                            right: 10,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="10 10" />
                        <XAxis
                            dataKey="titik"
                            angle={-45}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                            interval={0}
                        />
                        <YAxis>
                            <Label value="Rata-rata nilai" angle={-90} position="insideLeft" offset={-5} />
                        </YAxis>
                        <Tooltip />
                        <Bar dataKey="rata_rata_nilai">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor((entry as PM25DataProps)['rata_rata_nilai'])} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
