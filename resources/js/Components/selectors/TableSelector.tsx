import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useEffect, useState } from "react";

export const TableSelector = ({
    listTables,
    selectedTable = "",
    onSelectChange,
    isDisabled = false,
    filterTable = [],
    additionalTable = [],
}: {
    listTables: string[];
    selectedTable: string;
    onSelectChange: (value: string) => void;
    isDisabled?: boolean;
    filterTable?: string[]
    additionalTable?: string[]
}) => {
    const [filteredTables, setFilteredTables] = useState<string[]>([]);

    const handleSelectChange = (value: string) => {
        onSelectChange(value);
    };

    const changeFormat = (oldValue: string) => {
        return oldValue.split('_').join(' ').replace(/s$/, '');
    };

    useEffect(() => {
        // Filter tabel dan tambahkan tabel tambahan
        const finalTables = [
            ...listTables.filter((table) => !filterTable.includes(table)),
            ...additionalTable,
        ].sort();

        setFilteredTables(finalTables); // Simpan ke state lokal
    }, [listTables]);

    return (
        <Select
            value={selectedTable}
            onValueChange={handleSelectChange}
            disabled={isDisabled}
        >
            <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Table" />
            </SelectTrigger>
            <SelectContent>
                {filteredTables.map((value: string) => (
                    <SelectItem key={value} value={value} className="capitalize">
                        {changeFormat(value)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
