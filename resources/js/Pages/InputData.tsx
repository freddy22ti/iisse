import AuthenticatedLayout, { SidebarContext } from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TableSelector } from '@/Components/selectors/TableSelector';
import { ImportFileButton } from '@/Components/button/ImportFileButton';
import { AddColumnsButton } from '@/Components/button/AddColumnsButton';
import { router, usePage } from '@inertiajs/react'
import { AddTemplateButton } from '@/Components/button/AddTemplateButton';

import { addWaktuAttribute, filterDataByYearAndTerritory, getLatestYear } from '@/lib/utils';
import { DataTable } from '@/Components/DataTable';

export default function InputData(
    {
        data,
        tableColumns,
        listTables,
        listYears = [],
        listTerritories = [],
    }: {
        data: any[]
        tableColumns: string[]
        listTables: string[]
        listYears: string[]
        listTerritories: string[]
    }) {
    const FILTER_COLUMN = ['waktu', 'tahun', 'kecamatan']

    const { isSidebarCollapsed } = useContext(SidebarContext);

    // ambil nama tabel dari URL
    const url = usePage().url
    const processedData = url.split("/")
    const tableName = processedData.length > 2 ? decodeURIComponent(processedData[2]) : "";

    // variabel-variabel untuk handle reactivity tabel
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedTerritory, setSelectedTerritory] = useState<string>("");

    const transformData = () => {
        return addWaktuAttribute(data)
    }

    const filteredData = useMemo(() => {
        return filterDataByYearAndTerritory(transformData(), selectedYear, selectedTerritory);
    }, [data, selectedYear, selectedTerritory]);

    const handleTableSelect = (selectedTable: string) => {
        router.visit(
            route('input-data.with-table', selectedTable), {
            method: 'get',
        })
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

            <div className="p-10">
                <div className="flex mb-4">
                    <div className="">
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
                <div className={`bg-white shadow-sm p-6 border sm:rounded-lg ${isSidebarCollapsed ? "w-[90vw]" : "w-[75vw]"
                    }`}>
                    <DataTable
                        data={filteredData}
                        tableColumns={tableColumns}
                        selectedYear={selectedYear}
                        listYears={listYears}
                        handleYearChange={handleYearChange}
                        listTerritories={listTerritories}
                        selectedTerritory={selectedTerritory}
                        handleTerritoryChange={handleTerritoryChange}
                    />
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
