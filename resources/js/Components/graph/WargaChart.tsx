import { useEffect, useMemo, useState } from "react";
import {
    Label,
    Cell,
    YAxis,
    LabelList,
} from "recharts";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { YearSelector } from "@/Components/selectors/YearSelector";
import { filterDataByYearAndTerritory, getLatestYear } from "@/lib/utils";
import { GeneralDataProps } from "@/types";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";

export const WargaChart = ({
    data,
    globalYear,
    globalTerritory
}: {
    data: GeneralDataProps
    globalYear: string;
    globalTerritory: string
}) => {

    const [selectedYear, setSelectedYear] = useState<string>("");
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (data.listYears.length > 0) {
            const latestYear = getLatestYear(data.listYears)
            setSelectedYear(latestYear)
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
        setChartData(filteredData)
    }, [data.data, selectedYear, globalTerritory])

    const handleYearChange = (newYear: string | null) => {
        if (newYear) setSelectedYear(newYear);
    }


    const chartConfig = {
        laki_laki: {
            label: "Laki-laki",
            color: "hsl(var(--chart-1))",
        },
        perempuan: {
            label: "Perempuan",
            color: "hsl(var(--chart-2))",
        }
    } satisfies ChartConfig

    if (!data || !data.listYears || !data.data) {
        return <div>Loading...</div>;
    }


    if (!chartData || chartData.length === 0) {
        return (
            <Card>
                <CardContent className="text-center text-muted-foreground">
                    Tidak ada kasus untuk tahun dan kecamatan yang digunakan.
                </CardContent>
            </Card>
        );
    }

    const gradientId = (key: string) => `gradient-${key}`;


    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <CardTitle>Populasi Warga Pekanbaru</CardTitle>
                <div className="ms-auto flex items-center">
                    <YearSelector
                        listYears={data.listYears}
                        selectedYear={selectedYear}
                        handleYearChange={handleYearChange}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            right: 12,
                            bottom: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="kelompok_umur"
                            tickLine={true}
                            axisLine={false}
                            tickMargin={8}
                            angle={-45}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            // content={<ChartTooltipContent indicator="line" hideLabel />} />
                            content={<ChartTooltipContent
                                hideLabel
                                formatter={(value, name) => (
                                    <>
                                        <div
                                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                            style={
                                                {
                                                    "--color-bg": `var(--color-${name})`,
                                                } as React.CSSProperties
                                            }
                                        />
                                        <div className="flex min-w-[150px] items-center text-xs text-muted-foreground">

                                            {name}
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                {value} jiwa
                                            </div>
                                        </div>
                                    </>
                                )} />}
                        />
                        <defs>
                            <linearGradient id="lakiLaki" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-laki_laki)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-laki_laki)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="perempuan" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-perempuan)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-perempuan)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="laki_laki"
                            type="natural"
                            fill="url(#lakiLaki)"
                            fillOpacity={0.4}
                            stroke="var(--color-laki_laki)"
                            stackId="a"
                        />
                        <Area
                            dataKey="perempuan"
                            type="natural"
                            fill="url(#perempuan)"
                            fillOpacity={0.4}
                            stroke="var(--color-perempuan)"
                            stackId="a"
                        />

                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}