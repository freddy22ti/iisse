import { RangeYearFilterSelector } from "@/Components/selectors/RangeYearFilterSelector";
import { TerritorySelector } from "@/Components/selectors/TerritorySelector";
import { VariableSelector } from "@/Components/selectors/VariableSelector";
import { colors, EXCLUDED_COLUMNS, TABLE_WITHOUT_YEAR } from "@/const";
import { addWaktuAttribute, filterDataByRangeYearAndTerritory, formatColumnName, getLegendData } from "@/lib/utils";
import { GeneralDataProps } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Bar, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Label, Tooltip, Legend } from "recharts";


export const VisualisasiWarga = ({
    title,
    activeState,
    data,
}: {
    title: string;
    activeState: string;
    data: GeneralDataProps;
}) => {
    const [processedData, setProcessedData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [activeVariable, setActiveVariable] = useState<string>("");

    const [fromYear, setFromYear] = useState<string>("");
    const [toYear, setToYear] = useState<string>("");
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");

    const groupingKey = useMemo(
        () => (activeState === "temporal" ? "tahun" : "kecamatan"),
        [activeState]
    );

    useEffect(() => {
        if (data?.data) {
            const updatedData = TABLE_WITHOUT_YEAR.includes(title)
                ? addWaktuAttribute(data.data)
                : data.data;
            setProcessedData(updatedData);
        }
    }, [data, title])

    const filteredData = useMemo(() => {
        if (!processedData.length) return [];
        return filterDataByRangeYearAndTerritory(
            processedData,
            fromYear,
            toYear,
            selectedTerritory
        );
    }, [processedData, fromYear, toYear, selectedTerritory])


    const groupByTerritory = (data: any[], variable: string) => {
        return data.reduce((acc, item) => {
            const kecamatanKey = item.kecamatan ?? "Pekanbaru"; // Key by year
            const ageGroupKey = item.kelompok_umur; // Key by kelompok_umur
            const value = item[variable]; // Get the value of the specified variable

            // Check if the year already exists in the accumulator
            let kecamatanEntry = acc.find((entry: any) => entry.kecamatan === kecamatanKey);

            if (!kecamatanEntry) {
                // If the year doesn't exist, create a new entry
                kecamatanEntry = { kecamatan: kecamatanKey };
                acc.push(kecamatanEntry);
            }

            // Add the age group key with its corresponding value
            kecamatanEntry[ageGroupKey] = (kecamatanEntry[ageGroupKey] || 0) + value;


            return acc; // Return the accumulator
        }, []); // Initialize as an array
    }

    const groupByYear = (data: any[], variable: string) => {
        return data.reduce((acc, item) => {
            const yearKey = item.tahun; // Key by year
            const ageGroupKey = item.kelompok_umur; // Key by kelompok_umur
            const value = item[variable]; // Get the value of the specified variable

            // Check if the year already exists in the accumulator
            let yearEntry = acc.find((entry: any) => entry.tahun === yearKey);

            if (!yearEntry) {
                // If the year doesn't exist, create a new entry
                yearEntry = { tahun: yearKey };
                acc.push(yearEntry);
            }

            // Add the age group key with its corresponding value
            yearEntry[ageGroupKey] = (yearEntry[ageGroupKey] || 0) + value;

            return acc; // Return the accumulator
        }, []); // Initialize as an array
    };

    useEffect(() => {
        setSelectedTerritory("");
        setFromYear("");
        setToYear("");
    }, [activeState])

    useEffect(() => {
        if (!filteredData.length || !activeVariable) return
        const groupedData =
            activeState === "temporal"
                ? groupByYear(filteredData, activeVariable)
                : groupByTerritory(filteredData, activeVariable);
        setChartData(groupedData);

    }, [filteredData, activeVariable, activeState])

    const bars = useMemo(() => {
        return getLegendData(chartData, groupingKey).map((category, index) => (
            <Bar key={category} dataKey={category} fill={colors[index]} stackId="a" />
        ));
    }, [chartData, groupingKey, activeVariable]);


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


    const VariableSection = useMemo(() => (
        <div className="space-y-1">
            <div className="text-xs">Variable</div>
            <VariableSelector
                listColumns={data.columns}
                onColumnSelect={(variable) => setActiveVariable(variable ?? "")}
                additionalExcludedColumns={EXCLUDED_COLUMNS}
            />
        </div>
    ), [data]);

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
                        value={formatColumnName(activeVariable)}
                        angle={-90}
                        offset={-25}
                        position="insideLeft"
                        className="capitalize"
                    />
                </YAxis>
                <Tooltip />
                <Legend verticalAlign="top" />
                {bars}
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <div className="mb-16">
            <div className="flex items-center space-x-4">
                <div className="ms-auto">{FilterSection}</div>
                {VariableSection}
            </div>
            <div className="h-[400px]">
                <h2 className="mb-4 font-bold capitalize">{title}</h2>
                {chartData.length > 0 ?
                    renderCharts() :
                    <div className="h-full flex items-center justify-center">
                        No Data Available
                    </div>}
            </div>
        </div>
    )
}