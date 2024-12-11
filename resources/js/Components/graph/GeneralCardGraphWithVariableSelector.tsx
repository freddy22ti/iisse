import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
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
import { countAndGroup } from "@/lib/processData";
import { colors } from "@/const";
import { addWaktuAttribute, filterDataByYearAndTerritory, getLatestYear, getLegendData } from "@/lib/utils";
import { GeneralDataProps } from "@/types";
import { VariableSelector } from "@/Components/selectors/VariableSelector";


export const GeneralCardGraphWithVariableSelector = ({
    title,
    data,
    globalYear,
    globalTerritory,
    excludedColumns,
}: {
    title: string;
    data: GeneralDataProps;
    globalYear: string;
    globalTerritory: string;
    excludedColumns?: string[],
}) => {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedVariable, setSelectedVariable] = useState<string>("");

    // Add year column once when data is loaded
    useEffect(() => {
        data.data = addWaktuAttribute(data.data);
        if (data.listYears.length > 0) {
            getLatestYear(data.listYears)
        }
    }, [data.data]);


    // Handle year update with globalYear
    useEffect(() => {
        if (globalYear) setSelectedYear(globalYear);
    }, [globalYear]);


    // Memoize processed data based on selectedYear, globalTerritory, and variable
    const processedData = useMemo(() => {
        const filteredData = filterDataByYearAndTerritory(data.data, selectedYear, globalTerritory);
        return countAndGroup(filteredData, selectedVariable, "kecamatan");
    }, [data.data, selectedYear, globalTerritory, selectedVariable]);


    // Memoize legend data to optimize re-renders
    const barData = useMemo(() => getLegendData(processedData, "kecamatan"), [processedData]);


    // Helper function to render bars dynamically
    const renderBars = () => {
        if (barData.length > 0) {
            return (
                <ResponsiveContainer width="100%">
                    <BarChart
                        data={processedData}
                        margin={{ top: 20, bottom: 50, left: 20, right: 10 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="10 10" />
                        <XAxis
                            dataKey="kecamatan"
                            angle={-45}
                            textAnchor="end"
                            tick={{ fontSize: 12 }}
                            interval={0}
                        />
                        <YAxis type="number" allowDecimals={false} />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        {barData.map((category, index) => (
                            <Bar
                                key={category}
                                dataKey={category}
                                stackId="a"
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            );
        } else {
            return <div className="h-full flex items-center justify-center">No Data</div>;
        }
    };

    const handleChangeVariable = (variable: string) => {
        setSelectedVariable(variable)
    }

    return (
        <Card className="h-full">
            {/* Card Header */}
            <CardHeader className="flex flex-row items-center">
                <CardTitle>{title}</CardTitle>
                <div className="ms-auto flex items-center space-x-4">
                    <VariableSelector
                        listColumns={data.columns}
                        additionalExcludedColumns={excludedColumns}
                        onColumnSelect={handleChangeVariable}
                    />
                    <YearSelector
                        listYears={data.listYears}
                        selectedYear={selectedYear}
                        handleYearChange={(year: string | null) => setSelectedYear(year ?? "")}
                    />
                </div>
            </CardHeader>

            {/* Chart Content */}
            <CardContent className="h-[400px]">
                {renderBars()}
            </CardContent>
        </Card>
    );
};
