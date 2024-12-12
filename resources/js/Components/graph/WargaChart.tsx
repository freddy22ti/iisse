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
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";

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
    }, [data.listYears])

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

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center">
                <CardTitle>Population of Pekanbaru Residents</CardTitle>
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
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                right: 12,
                                bottom: 20,
                                left: 12,
                                top: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="kelompok_umur"
                                tickLine={true}
                                axisLine={false}
                                tickMargin={8}
                                angle={-45}
                            >
                                <Label
                                    value="Kelompok Umur"
                                    position="bottom"
                                    className="capitalize"
                                />
                            </XAxis>
                            <YAxis>
                                <Label
                                    value="Jumlah Populasi"
                                    angle={-90}
                                    offset={0}
                                    position="insideLeft"
                                    className="capitalize"
                                />
                            </YAxis>
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
                ) : (
                    <div className="h-full flex items-center justify-center">
                        No Data
                    </div>
                )}
            </CardContent>
        </Card>
    )
}