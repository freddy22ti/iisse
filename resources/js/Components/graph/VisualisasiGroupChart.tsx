import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Label,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { VariableSelector } from "@/Components/selectors/VariableSelector";
import { TerritorySelector } from "@/Components/selectors/TerritorySelector";
import { RangeYearFilterSelector } from "@/Components/selectors/RangeYearFilterSelector";

import {
    colors,
    EXCLUDED_COLUMNS,
    TABLE_WITHOUT_YEAR,
} from "@/const";
import {
    addWaktuAttribute,
    filterDataByRangeYearAndTerritory,
    getLegendData,
    formatColumnName,
} from "@/lib/utils";
import { GeneralDataProps } from "@/types";
import { countAndGroup, groupByTerritory, groupByYear } from "@/lib/processData";

export const VisualisasiGroupChart = ({
    title,
    activeState,
    data,
}: {
    title: string;
    activeState: string;
    data: GeneralDataProps;
}) => {
    // States
    const [processedData, setProcessedData] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [activeVariable, setActiveVariable] = useState<string>("");

    const [fromYear, setFromYear] = useState<string>("");
    const [toYear, setToYear] = useState<string>("");
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");
    const [isCategoricalData, setIsCategoricalData] = useState(false);


    // Derived States
    const groupingKey = useMemo(
        () => (activeState === "temporal" ? "tahun" : "kecamatan"),
        [activeState]
    );

    // Add temporal attributes if necessary
    useEffect(() => {
        if (data?.data) {
            const updatedData = TABLE_WITHOUT_YEAR.includes(title)
                ? addWaktuAttribute(data.data)
                : data.data;
            setProcessedData(updatedData);
        }
    }, [data, title]);

    // Filter data by year and territory
    const filteredData = useMemo(() => {
        if (!processedData.length) return [];
        return filterDataByRangeYearAndTerritory(
            processedData,
            fromYear,
            toYear,
            selectedTerritory
        );
    }, [processedData, fromYear, toYear, selectedTerritory]);

    // Reset filters when activeState changes
    useEffect(() => {
        setSelectedTerritory("");
        setFromYear("");
        setToYear("");
    }, [activeState]);

    // Update chart data based on selected variable
    useEffect(() => {
        if (!filteredData.length || !activeVariable) return;

        const sampleVariableValue = filteredData[0][activeVariable];
        if (typeof sampleVariableValue === "number") {
            const groupedData =
                activeState === "temporal"
                    ? groupByYear(filteredData, activeVariable)
                    : groupByTerritory(filteredData, activeVariable);
            setChartData(groupedData);
            setIsCategoricalData(false);
        } else {
            const groupedData = countAndGroup(filteredData, activeVariable, groupingKey, "");
            setChartData(groupedData);
            setIsCategoricalData(true);
        }
    }, [filteredData, activeVariable, activeState, groupingKey]);

    // Generate Bars for Chart
    const bars = useMemo(() => {
        if (isCategoricalData) {
            return getLegendData(chartData, groupingKey).map((category, index) => (
                <Bar key={category} dataKey={category} fill={colors[index]} stackId="a" />
            ));
        }
        return <Bar dataKey={activeVariable} fill={colors[0]} radius={4} />;
    }, [isCategoricalData, chartData, groupingKey, activeVariable]);


    // Filter and Variable Sections
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
                {isCategoricalData && <Legend verticalAlign="top" />}
                {bars}
            </BarChart>
        </ResponsiveContainer>
    );


    // Main Render
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
    );
};
