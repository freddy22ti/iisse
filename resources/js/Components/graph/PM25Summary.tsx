import { getLatestYear, filterDataByYearAndTerritory } from "@/lib/utils";
import { GeneralDataProps, PM25DataProps, PM25SummaryProps } from "@/types"
import { useEffect, useMemo, useState } from "react";
import { YearSelector } from "../selectors/YearSelector";
import { Bar, BarChart, CartesianGrid, Cell, Label, LabelList, Legend, Line, LineChart, Rectangle, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart"


export const PM25Summary = ({
    data,
    globalYear,
    globalTerritory,
}: {
    data: GeneralDataProps
    globalYear: string
    globalTerritory: string
}) => {
    const [chartData, setChartData] = useState<PM25SummaryProps[]>([]);

    const [selectedYear, setSelectedYear] = useState<string>('')

    // update year dengan nilai global
    useEffect(() => {
        if (globalYear) setSelectedYear(globalYear);
        else setSelectedYear(getLatestYear(data.listYears))
    }, [globalYear])

    // olah data supaya bisa ditampilkan dengan filter
    useEffect(() => {
        // filter data berdasarkan tahun dan kecamatan
        const filteredData = filterDataByYearAndTerritory(data.data, selectedYear, globalTerritory);
        setChartData(filteredData)
    }, [data.data, selectedYear, globalTerritory])


    const handleYearChange = (newYear: string | null) => {
        if (newYear) setSelectedYear(newYear);
    }

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        const kecamatan = [...new Set(chartData.map(item => item.kecamatan))];
        kecamatan.forEach((nama, index) => {
            config[nama] = {
                label: nama.charAt(0).toUpperCase() + nama.slice(1),
                color: `hsl(var(--chart-${(index + 1) % 6}))`,
            };
        });
        return config;
    }, [chartData]);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center">
                <CardTitle>Average PM2.5</CardTitle>
                <div className="ms-auto flex items-center">
                    <YearSelector
                        listYears={data.listYears}
                        selectedYear={selectedYear}
                        handleYearChange={handleYearChange}
                    />
                </div>
            </CardHeader>
            <CardContent className="h-[400px]">
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 0,
                                left: 10,
                                right: 12,
                                bottom: 60,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="kecamatan"
                                angle={-45}
                                tickLine={false}
                                axisLine={false}
                                textAnchor="end"

                                tickMargin={8}
                                tick={{ fontSize: 12 }}
                                interval={0}


                            />
                            <YAxis type="number" allowDecimals={false}>
                                <Label
                                    value="Rata-rata PM25"
                                    angle={-90}
                                    offset={0}
                                    position="insideLeft"
                                    className="capitalize"
                                />
                            </YAxis>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Legend verticalAlign="top" />
                            <Line
                                dataKey="rata_rata_pm25"
                                type="natural" />
                        </LineChart>
                    </ChartContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        No Data
                    </div>
                )}
            </CardContent>
        </Card>

    )
}