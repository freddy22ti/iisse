import { useEffect, useState } from 'react';
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
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ArrowUpDown } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { YearSelector } from '@/Components/selectors/YearSelector';
import { TerritorySelector } from '@/Components/selectors/TerritorySelector';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { formatColumnName } from '@/lib/utils';
import { ScrollArea, ScrollBar } from './ui/scroll-area';


export const DataTable = ({
    data = [],
    tableColumns = [],
    listYears,
    selectedYear,
    handleYearChange,
    listTerritories,
    selectedTerritory,
    handleTerritoryChange,
}: {
    data: any[]
    tableColumns: string[]
    listYears: string[]
    selectedYear: string
    handleYearChange: (year: string | null) => void
    listTerritories: string[]
    selectedTerritory: string
    handleTerritoryChange: (year: string | null) => void
}) => {
    const FILTERED_COLUMNS_IN_SELECTOR = [
        'waktu',
        'kecamatan',
        'tahun',
    ]

    const [columns, setColumns] = useState<any[]>([]);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [selectedFilteredColumn, setSelectedFilteredColumn] = useState<string>("");

    useEffect(() => {
        // Pastikan tableColumns adalah array
        if (!Array.isArray(tableColumns)) {
            const valuesArray: string[] = Object.values(tableColumns);
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
                            {formatColumnName(col)}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
            }));
        setColumns(formattedColumns);
    }, [tableColumns])

    // Initialize the table instance with data and columns
    const table = useReactTable({
        data: data,
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
    })

    return (
        <div className='px-4'>
            <div className="flex">
                <div className='flex items-center py-2 space-x-4'>
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
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Column" />
                        </SelectTrigger>
                        <SelectContent>
                            {columns.filter((column) =>
                                !FILTERED_COLUMNS_IN_SELECTOR.includes(column.accessorKey)
                            ).map((column) => (
                                <SelectItem key={column.accessorKey} value={column.accessorKey}>
                                    {formatColumnName(column.accessorKey)}
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

                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto me-4">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {formatColumnName(column.id)}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ScrollArea className=''>
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
                <ScrollBar orientation="horizontal" />
            </ScrollArea>


            {/* End of data table */}
            <div className="flex items-center justify-end space-x-2 pt-4">
                <div className="text-sm mx-5">
                    Total Data: {table.getFilteredRowModel().rows.length}
                </div>
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
        </div >
    )
}