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
    Label,
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
import useSortedLegendData from "@/hooks/sortDataByArrayOrder";


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

    const [tempData, setTempData] = useState<any[]>([])

    // Add year column once when data is loaded
    useEffect(() => {
        const processedData = addWaktuAttribute(data.data || []);
        if (data.listYears?.length > 0) {
            const year = getLatestYear(data.listYears);
            setSelectedYear(year);
        }
        setTempData(processedData);
    }, [data.data, data.listYears]);

    useEffect(() => {
        if (globalYear) setSelectedYear(globalYear);
        else if (data.listYears?.length > 0) {
            setSelectedYear(getLatestYear(data.listYears));
        }
    }, [globalYear, data.listYears]);

    // Memoize processed data based on selectedYear, globalTerritory, and variable
    const processedData = useMemo(() => {
        if (!tempData.length) return [];
        const filteredData = filterDataByYearAndTerritory(tempData, selectedYear, globalTerritory);
        return countAndGroup(filteredData, selectedVariable, "kecamatan");
    }, [tempData, selectedYear, globalTerritory, selectedVariable]);

    // Memoize legend data to optimize re-renders
    const barData = useSortedLegendData(processedData, title, selectedVariable)

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
                        <YAxis type="number" allowDecimals={false}>
                            <Label
                                value="Jumlah Data"
                                angle={-90}
                                offset={0}
                                position="insideLeft"
                                className="capitalize"
                            />
                        </YAxis>
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        {barData.map((category, index) => (
                            < Bar
                                key={category}
                                dataKey={category}
                                stackId="a"
                                fill={colors[index % colors.length]}
                            />
                        )
                        )}
                    </BarChart>
                </ResponsiveContainer>
            );
        } else {
            return <div className="h-full flex items-center justify-center">No Data</div>;
        }
    };

    return (
        <Card className="h-full">
            {/* Card Header */}
            <CardHeader className="flex flex-row items-center">
                <CardTitle>{title}</CardTitle>
                <div className="ms-auto flex items-center space-x-4">
                    <VariableSelector
                        listColumns={data.columns}
                        additionalExcludedColumns={excludedColumns}
                        onColumnSelect={(variable: string) => setSelectedVariable(variable)}
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
