import { useEffect, useMemo, useState } from "react";
import {
    Label,
    Cell,
} from "recharts";

import { Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { YearSelector } from "@/Components/selectors/YearSelector";
import { filterDataByYearAndTerritory, getLatestYear } from "@/lib/utils";
import { GeneralDataProps } from "@/types";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/Components/ui/chart";


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

    const totalKasus = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.jumlah_kasus, 0)
    }, [chartData])

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        const jenisPenyakit = [...new Set(chartData.map(item => item.jenis_penyakit))];
        jenisPenyakit.forEach((penyakit, index) => {
            config[penyakit] = {
                label: penyakit.charAt(0).toUpperCase() + penyakit.slice(1),
                color: `hsl(var(--chart-${(index + 1) % 6}))`,
            };
        });
        return config;
    }, [chartData]);

    const handleYearChange = (newYear: string | null) => {
        if (newYear) setSelectedYear(newYear);
    }

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

    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <CardTitle>Perkembangan Penyakit</CardTitle>
                <div className="ms-auto flex items-center">
                    <YearSelector
                        listYears={data.listYears}
                        selectedYear={selectedYear}
                        handleYearChange={handleYearChange}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[400px] [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
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
                                                {value} kasus
                                            </div>
                                        </div>
                                    </>
                                )} />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="jumlah_kasus"
                            nameKey="jenis_penyakit"
                            innerRadius={90}
                            label>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalKasus.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Jumlah kasus
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={chartConfig[entry.jenis_penyakit]?.color || `hsl(${index * 30}, 70%, 80%)`} />
                            ))}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="jenis_penyakit" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card >
    );
};
