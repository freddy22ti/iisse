import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { TableSelector } from '@/Components/selectors/TableSelector';
import { ImportFileButton } from '@/Components/button/ImportFileButton';
import { AddColumnsButton } from '@/Components/button/AddColumnsButton';
import {
    flexRender,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ArrowUpDown } from "lucide-react"
import { router, usePage } from '@inertiajs/react'
import { AddTemplateButton } from '@/Components/button/AddTemplateButton';
import { YearSelector } from '@/Components/selectors/YearSelector';
import { TerritorySelector } from '@/Components/selectors/TerritorySelector';
import { filterDataByYearAndTerritory } from '@/lib/utils';

export default function InputData(
    {
        data,
        tableColumns,
        listTables,
        listYears = [],
        listTerritories = [],
    }: {
        data: any[]
        tableColumns: any[]
        listTables: string[]
        listYears: string[]
        listTerritories: string[]
    }) {
    const FILTER_COLUMN = ['waktu', 'tahun', 'kecamatan']

    // ambil nama tabel dari URL
    const url = usePage().url
    const processedData = url.split("/")
    const tableName = processedData.length > 2 ? decodeURIComponent(processedData[2]) : "";

    // variabel-variabel untuk handle reactivity tabel
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");

    const [columns, setColumns] = useState<any[]>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [selectedFilteredColumn, setSelectedFilteredColumn] = useState<string>("");

    useEffect(() => {
        // Pastikan tableColumns adalah array
        if (!Array.isArray(tableColumns)) {
            const valuesArray = Object.values(tableColumns);
            tableColumns = valuesArray
        }

        // Format columns and exclude 'id' column
        const formattedColumns = tableColumns
            .filter(col => col != 'id') // Exclude 'id' column
            .map((col) => ({
                accessorKey: col,
                header: ({ column }: { column: any }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className='capitalize'
                        >
                            {changeFormat(col)}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
            }));
        setColumns(formattedColumns);
    }, [tableColumns])

    const filteredData = useMemo(() => {
        return filterDataByYearAndTerritory(data, selectedYear, selectedTerritory);
    }, [data, selectedYear, selectedTerritory]);

    // Initialize the table instance with data and columns
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnVisibility,
            columnFilters,
        },
    });

    const handleTableSelect = (selectedTable: string) => {
        router.visit(
            route('input-data.with-table', selectedTable), {
            method: 'get',
        })
    };

    const changeFormat = (oldValue: string) => {
        return oldValue.split('_').join(' ').replace(/s$/, '');
    };

    const handleYearChange = (newYear: string | null) => {
        setSelectedYear(newYear || "")
    }

    const handleTerritoryChange = (newTerritory: string | null) => {
        setSelectedTerritory(newTerritory || "")
    }

    return (
        <AuthenticatedLayout>
            <Head title="Input Data" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex mb-8">
                        <div className="bg-white">
                            <TableSelector
                                onSelectChange={handleTableSelect}
                                listTables={listTables}
                                selectedTable={tableName}
                            />
                        </div>
                        <div className="ms-auto">
                            <AddTemplateButton listTables={listTables} />
                        </div>
                        <div className="ms-4">
                            <ImportFileButton
                                listTables={listTables}
                            />
                        </div>
                        <div className="ms-4">
                            <AddColumnsButton
                                listTables={listTables} />
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 rounded-md border w-[78lvw]">
                            <div className="flex items-center py-4 space-x-2">
                                <YearSelector
                                    listYears={listYears}
                                    selectedYear={selectedYear}
                                    handleYearChange={handleYearChange}
                                />
                                <TerritorySelector
                                    listTerritories={listTerritories}
                                    selectedTerritory={selectedTerritory}
                                    handleTerritoryChange={handleTerritoryChange}
                                />
                                <Select onValueChange={(value) => setSelectedFilteredColumn(value)}>
                                    <SelectTrigger className="w-[180px] me-4">
                                        <SelectValue placeholder="Column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map((column) => (
                                            <SelectItem key={column.accessorKey} value={column.accessorKey}>
                                                {changeFormat(column.accessorKey)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Filter..."
                                    onChange={(event) =>
                                        selectedFilteredColumn &&
                                        table.getColumn(selectedFilteredColumn)?.setFilterValue(event.target.value)
                                    }
                                    disabled={selectedFilteredColumn === ''}
                                    className="max-w-sm"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="ml-auto">
                                            Columns
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {table
                                            .getAllColumns()
                                            .filter(
                                                (column) => column.getCanHide()
                                            )
                                            .map((column) => {
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        className="capitalize"
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(value) =>
                                                            column.toggleVisibility(!!value)
                                                        }
                                                    >
                                                        {column.id}
                                                    </DropdownMenuCheckboxItem>
                                                )
                                            })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {/* Data table */}
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id} className='text-center'>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className='text-center'>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {/* End of data table */}
                            <div className="flex items-center justify-end space-x-2 pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
