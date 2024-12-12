import { RangeYearFilterSelector } from "@/Components/selectors/RangeYearFilterSelector";
import { TerritorySelector } from "@/Components/selectors/TerritorySelector";
import { colors, } from "@/const";
import { filterDataByRangeYearAndTerritory, getLegendData, formatColumnName } from "@/lib/utils";
import { GeneralDataProps, PM25SummaryProps } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { Bar, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Label, Tooltip, Legend } from "recharts";

export const VisualisasiPM25 = ({
    title,
    activeState,
    data,
}: {
    title: string;
    activeState: string;
    data: GeneralDataProps;
}) => {
    const [chartData, setChartData] = useState<any[]>([]);

    const [fromYear, setFromYear] = useState<string>("");
    const [toYear, setToYear] = useState<string>("");
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");

    const groupingKey = useMemo(
        () => (activeState === "temporal" ? "tahun" : "kecamatan"),
        [activeState]
    );

    const filteredData = useMemo(() => {
        return filterDataByRangeYearAndTerritory(
            data.data,
            fromYear,
            toYear,
            selectedTerritory
        );
    }, [data.data, fromYear, toYear, selectedTerritory])


    useEffect(() => {
        if (activeState === "temporal") {
            setSelectedTerritory("");
        } else if (activeState === "spasial") {
            setFromYear("");
            setToYear("");
        }
    }, [activeState]);

    const calculateAvgEachYear = (data: PM25SummaryProps[]) => {
        // Group data by tahun
        const groupedByYear: { [key: string]: number[] } = data.reduce((acc, item) => {
            if (!acc[item.tahun]) {
                acc[item.tahun] = [];
            }
            acc[item.tahun].push(item.rata_rata_pm25);
            return acc;
        }, {} as { [key: string]: number[] });

        // Calculate average for each year
        const averages = Object.entries(groupedByYear).map(([tahun, values]) => {
            const total = values.reduce((sum, val) => sum + val, 0);
            const avg = total / values.length;
            return { tahun, rata_rata_pm25: avg };
        });

        return averages;
    }

    useEffect(() => {
        if (!filteredData.length) return
        const groupedData =
            activeState === "temporal"
                ? calculateAvgEachYear(filteredData)
                : filteredData
        setChartData(groupedData);
    }, [filteredData, activeState])

    const FilterSection = useMemo(() => (
        activeState === "spasial" ? (
            <RangeYearFilterSelector
                fromYear={fromYear}
                toYear={toYear}
                setFromYear={setFromYear}
                setToYear={setToYear}
                listYears={data.listYears}
            />
        ) : (
            <div className="space-y-1">
                <div className="text-xs">Subdistrict</div>
                <TerritorySelector
                    selectedTerritory={selectedTerritory}
                    handleTerritoryChange={(territory) => setSelectedTerritory(territory ?? "")}
                    listTerritories={data.listTerritories}
                />
            </div>
        )
    ), [activeState, fromYear, toYear, selectedTerritory, data]);

    // Chart Rendering
    const renderCharts = () => (
        <ResponsiveContainer width="100%">
            <BarChart data={chartData} margin={{ top: 20, bottom: 80, left: 40, right: 10 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={groupingKey}
                    tickLine={false}
                    angle={-45}
                    tickMargin={40}
                    axisLine={false}
                    interval={0}
                />
                <YAxis>
                    <Label
                        value={"Total Nilai PM25"}
                        angle={-90}
                        offset={-25}
                        position="insideLeft"
                        className="capitalize"
                    />
                </YAxis>
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar key="rata_rata_pm25" dataKey="rata_rata_pm25" fill={colors[0]} stackId="a" />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <div className="mb-16">
            <div className="flex items-center space-x-4">
                <div className="ms-auto">{FilterSection}</div>
            </div>
            <div className="h-[400px]">
                <h2 className="mb-4 font-bold capitalize">PM2.5</h2>
                {chartData.length > 0 ?
                    renderCharts()
                    :
                    <div className="h-full flex items-center justify-center">
                        No Data Available
                    </div>}
            </div>
        </div>
    )
}