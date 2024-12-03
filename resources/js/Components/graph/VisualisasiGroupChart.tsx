
import { VariableSelector } from '@/Components/selectors/VariableSelector';
import { GeneralDataProps } from '@/types';
import { YearSelector } from '@/Components/selectors/YearSelector';
import { TerritorySelector } from '@/Components/selectors/TerritorySelector';
import { colors, EXCLUDED_COLUMNS } from '@/const';
import { addWaktuAttribute, filterDataByYearAndTerritory, formatColumnName, getLegendData } from '@/lib/utils';
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
import { countAndGroup, groupByTerritory, groupByYear, sumValueAndGroup } from '@/lib/processData';
import { useEffect, useMemo, useState } from 'react';

export const VisualisasiGroupChart = ({
    title,
    activeState,
    data,
}: {
    title: string;
    activeState: string;
    data: GeneralDataProps;
}) => {
    const TABLE_WITHOUT_TAHUN = ["sosial", "demografi", "ekonomi", "PM25"];

    const [activeVariable, setActiveVariable] = useState<string>("");
    const [categoricalVariable, setCategoricalVariable] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");
    const [chartData, setChartData] = useState<any[]>([]);
    const [isCategoricalData, setIsCategoricalData] = useState(false);

    // Grouping key berdasarkan `activeState`
    const groupingKey = activeState === "temporary" ? "tahun" : "kecamatan"

    // Data yang sudah difilter berdasarkan `selectedYear` dan `selectedTerritory`
    const filteredData = useMemo(() => {
        return filterDataByYearAndTerritory(data.data, selectedYear, selectedTerritory);
    }, [data, selectedYear, selectedTerritory]);


    // Variabel kategorikal (hanya kolom string)
    const listCategoricalVariable = useMemo(() => {
        if (!data.data.length) return [];
        return Object.keys(data.data[0]).filter(
            (key) => typeof data.data[0][key] === "string"
        );
    }, [data]);


    const hasStringAndNumberColumns = useMemo(() => {
        if (!data.data.length) return false;

        const columnTypes = Object.keys(data.data[0]).reduce(
            (types, key) => {
                const value = data.data[0][key as keyof typeof data.data[0]];
                if (typeof value === "string") types.hasString = true;
                if (typeof value === "number") types.hasNumber = true;
                return types;
            },
            { hasString: false, hasNumber: false }
        );

        return columnTypes.hasString && columnTypes.hasNumber;
    }, [data]);


    const handleTerritoryChange = (newTerritory: string | null) =>
        setSelectedTerritory(newTerritory || "");
    const handleYearChange = (newYear: string | null) =>
        setSelectedYear(newYear || "");
    const handleActiveVariableChange = (newActiveVariable: string | null) => setActiveVariable(newActiveVariable || "")
    const handleCategoricalVariableChange = (newCategoricalVariable: string | null) => setCategoricalVariable(newCategoricalVariable || "")

    // Menambahkan atribut waktu ke data jika diperlukan
    useEffect(() => {
        if (TABLE_WITHOUT_TAHUN.includes(title)) {
            data.data = addWaktuAttribute(data.data);
        }
    }, [title, data]);


    // Reset filter saat `activeState` berubah
    useEffect(() => {
        setSelectedYear("");
        setSelectedTerritory("");
    }, [activeState]);


    // Perbarui data chart berdasarkan variabel yang dipilih
    useEffect(() => {
        if (!filteredData.length || !activeVariable) return;

        const sampleVariableValue = filteredData[0][activeVariable];
        if (sampleVariableValue !== undefined) {
            if (typeof sampleVariableValue === "number") {
                const groupedData =
                    activeState === "temporary"
                        ? groupByYear(filteredData, activeVariable)
                        : groupByTerritory(filteredData, activeVariable);
                setChartData(groupedData);
                setIsCategoricalData(false);
            } else {
                const groupedData = countAndGroup(filteredData, activeVariable, groupingKey, "");
                setChartData(groupedData);
                setIsCategoricalData(true)
            }
        }
    }, [filteredData, activeVariable, groupingKey, activeState, categoricalVariable]);


    const renderFilterSelector = () => {
        return activeState === "spatial" ? (
            <YearSelector
                selectedYear={selectedYear}
                handleYearChange={handleYearChange}
                listYears={data.listYears}
            />
        ) : (
            <TerritorySelector
                selectedTerritory={selectedTerritory}
                handleTerritoryChange={handleTerritoryChange}
                listTerritories={data.listTerritories}
            />
        );
    };


    const renderCharts = () => {
        return (
            <ResponsiveContainer width="100%">
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
        )
    }


    const bars = useMemo(() => {
        if (isCategoricalData) {
            return getLegendData(chartData, groupingKey).map((category, index) => (
                <Bar
                    key={category}
                    dataKey={category}
                    fill={colors[index]}
                    stackId="a"
                />
            ));
        }
        return (
            <Bar
                dataKey={activeVariable}
                fill={colors[0]}
                radius={4}
            />
        );
    }, [isCategoricalData, chartData, groupingKey, activeVariable]);


    const noData = () => {
        return <div className="h-full flex items-center justify-center">No Data Available</div>;
    }

    const categorySelector = () => {
        if (!hasStringAndNumberColumns) return null;

        return (
            <div className='flex items-center mt-2 mb-2'>
                <p className='text-sm me-2'>Group BY:</p>
                <VariableSelector
                    listColumns={listCategoricalVariable}
                    onColumnSelect={handleCategoricalVariableChange}
                    additionalExcludedColumns={EXCLUDED_COLUMNS}
                />
            </div>
        )
    }

    return (
        <div className='mb-16'>
            <div className="flex items-center space-x-4">
                <div className="ms-auto">
                    {renderFilterSelector()}
                </div>
                <VariableSelector
                    listColumns={data.columns}
                    onColumnSelect={handleActiveVariableChange}
                    additionalExcludedColumns={EXCLUDED_COLUMNS}
                />
            </div>
            <div className='h-[400px]'>
                <h2 className="mb-4 font-bold capitalize">{title}</h2>
                {(chartData.length > 0) ? renderCharts() : noData()}
            </div>
        </div>
    );
};
