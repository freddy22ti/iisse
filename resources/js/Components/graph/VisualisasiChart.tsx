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
import {
    countAndGroup,
    groupByYear,
    groupByTerritory,
    sumValueAndGroup,
} from "@/lib/processData";
import { useState, useEffect, useMemo } from "react";
import { YearSelector } from "@/Components/selectors/YearSelector";
import { TerritorySelector } from "@/Components/selectors/TerritorySelector";
import { VariableSelector } from "@/Components/selectors/VariableSelector";
import { colors, EXCLUDED_COLUMNS } from "@/const";
import {
    addWaktuAttribute,
    filterDataByYearAndTerritory,
    formatColumnName,
    getLegendData,
} from "@/lib/utils";

export const VisualisasiChart = ({
    title,
    activeState,
    data,
    listColumns,
    listYears,
    listTerritories,
}: {
    title: string;
    activeState: string;
    data: any[];
    listColumns: string[];
    listYears: string[];
    listTerritories: string[];
}) => {
    const TABLE_WITHOUT_TAHUN = ["sosial", "ekonomi", "PM25"];

    // Filter states
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedVariable, setSelectedVariable] = useState<string>("");

    // Chart states
    const [chartData, setChartData] = useState<any[]>([]);
    const [uniqueVariables, setUniqueVariables] = useState<string[]>([]);
    const [isCategoricalData, setIsCategoricalData] = useState(false);

    // Determine grouping state
    const groupingKey = useMemo(() => (activeState === "temporary" ? "tahun" : "kecamatan"), [activeState]);

    // Filtered data
    const filteredData = useMemo(() => {
        return filterDataByYearAndTerritory(data, selectedYear, selectedTerritory);
    }, [data, selectedYear, selectedTerritory]);

    // Process data for chart
    useEffect(() => {
        if (!filteredData.length || !selectedVariable) {
            setChartData([]);
            setUniqueVariables([]);
            return;
        }

        if (title === "kasus penyakit" && selectedVariable === "jenis_penyakit") {
            const { formattedData, uniqueVariable } = sumValueAndGroup(
                filteredData,
                groupingKey,
                selectedVariable,
                "jumlah_kasus"
            );
            setChartData(formattedData);
            setUniqueVariables(uniqueVariable);
            return;
        }

        const sampleVariableValue = filteredData[0]?.[selectedVariable];
        if (sampleVariableValue !== undefined) {
            if (!isNaN(sampleVariableValue)) {
                const groupedData =
                    activeState === "temporary"
                        ? groupByYear(filteredData, selectedVariable)
                        : groupByTerritory(filteredData, selectedVariable);
                setChartData(groupedData);
                setIsCategoricalData(false);
            } else {
                const groupedData = countAndGroup(filteredData, selectedVariable, groupingKey);
                setChartData(groupedData);
                setIsCategoricalData(true);
            }
        }
    }, [filteredData, selectedVariable, title, groupingKey]);

    // Add "tahun" attribute to data if applicable
    useEffect(() => {
        if (TABLE_WITHOUT_TAHUN.includes(title)) {
            data = addWaktuAttribute(data);
        }
    }, [title, data]);

    // Reset filters when active state changes
    useEffect(() => {
        setSelectedYear("");
        setSelectedTerritory("");
    }, [activeState]);

    // Handlers
    const handleTerritoryChange = (newTerritory: string | null) =>
        setSelectedTerritory(newTerritory || "");
    const handleYearChange = (newYear: string | null) =>
        setSelectedYear(newYear || "");
    const handleVariableChange = (newVariable: string) =>
        setSelectedVariable(newVariable);

    // Render filter selectors
    const renderFilterSelector = () => {
        return activeState === "spatial" ? (
            <YearSelector
                selectedYear={selectedYear}
                handleYearChange={handleYearChange}
                listYears={listYears}
            />
        ) : (
            <TerritorySelector
                selectedTerritory={selectedTerritory}
                handleTerritoryChange={handleTerritoryChange}
                listTerritories={listTerritories}
            />
        );
    };

    // Render bars for chart
    const renderBars = () => {
        return isCategoricalData
            ? getLegendData(chartData, groupingKey).map((category, index) => (
                  <Bar
                      key={category}
                      dataKey={category}
                      fill={colors[index]}
                      stackId="a"
                  />
              ))
            : (
                  <Bar
                      dataKey={selectedVariable}
                      fill={colors[0]}
                      radius={4}
                  />
              );
    };

    // Component render
    return (
        <>
            {/* Filters */}
            <div className="flex items-center space-x-4">
                <div className="ms-auto">{renderFilterSelector()}</div>
                <VariableSelector
                    listColumns={listColumns}
                    onColumnSelect={handleVariableChange}
                    additionalExcludedColumns={EXCLUDED_COLUMNS}
                />
            </div>
            {/* Chart */}
            <div>
                <h2 className="mb-4 font-bold capitalize">{title}</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, bottom: 80, left: 40, right: 10 }}
                    >
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
                                value={formatColumnName(selectedVariable)}
                                angle={-90}
                                offset={-25}
                                position="insideLeft"
                                className="capitalize"
                            />
                        </YAxis>
                        <Tooltip />
                        {isCategoricalData && <Legend verticalAlign="top" />}
                        {renderBars()}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};
