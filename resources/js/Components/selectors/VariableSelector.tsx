import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { formatColumnName } from "@/lib/utils";
import { EXCLUDED_COLUMNS } from "@/const";

export const VariableSelector = ({
    listColumns,
    onColumnSelect,
    additionalExcludedColumns = [],
}: {
    listColumns: string[];
    onColumnSelect: (columnName: string) => void;
    additionalExcludedColumns?: string[];
}) => {
    const [selectedColumn, setSelectedColumn] = useState<string>("");

    // Memoize the combined excluded columns list to optimize re-renders
    const excludedColumns = useMemo(() => {
        const combinedExcludedColumns = new Set([
            ...EXCLUDED_COLUMNS,
            ...additionalExcludedColumns,
        ]);
        return combinedExcludedColumns;
    }, [additionalExcludedColumns]);

    // Memoize the filtered columns to optimize re-renders
    const filteredColumns = useMemo(
        () => listColumns.filter((col) => !excludedColumns.has(col)),
        [listColumns]
    );

    // Handle column selection
    const handleSelect = (col: string) => {
        setSelectedColumn(col);
        onColumnSelect(col);
    };

    // Set the default selected column when filteredColumns change
    useEffect(() => {
        if (filteredColumns.length > 0) {
            const defaultColumn = filteredColumns[0];
            handleSelect(defaultColumn)
        }
    }, [filteredColumns]);

    return (
        <Select
            onValueChange={handleSelect}
            value={selectedColumn}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Variable" />
            </SelectTrigger>
            <SelectContent>
                {filteredColumns.map((col) => (
                    <SelectItem value={col} key={col} className="capitalize">
                        {formatColumnName(col)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
