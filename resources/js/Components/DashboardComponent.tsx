import { useState } from 'react';
import { YearSelector } from '@/Components/selectors/YearSelector';
import { TerritorySelector } from '@/Components/selectors/TerritorySelector';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { PM25 } from '@/Components/graph/PM25';
import { GeneralCardGraphWithVariableSelector } from '@/Components/graph/GeneralCardGraphWithVariableSelector';
import { GeneralDataProps, PM25DataProps } from '@/types';
import { DiseaseDevelopment } from '@/Components/graph/DiseaseDevelopment';
import { WargaChart } from './graph/WargaChart';

export const DashboardComponent = ({
    listYears,
    listTerritories,
    ekonomiData,
    penyakitData,
    pm25Data,
    sosialData,
    wargaData,
}: {
    listYears: string[]
    listTerritories: string[]
    ekonomiData: GeneralDataProps
    penyakitData: GeneralDataProps
    pm25Data: PM25DataProps[]
    sosialData: GeneralDataProps
    wargaData: GeneralDataProps
}) => {
    const [year, setYear] = useState<string>("");
    const [territory, setTerritory] = useState<string>("")


    const handleYearChange = (selectedYear: string | null) => {
        if (selectedYear) setYear(selectedYear)
        else setYear("")
    }


    const handleTerritoryChange = (selectedTerritory: string | null) => {
        if (selectedTerritory) setTerritory(selectedTerritory)
        else setTerritory("")
    }

    return (
        <>
            <div className="flex mb-6">
                {/* filter */}
                <div className="ms-auto me-4">
                    <YearSelector
                        selectedYear={year}
                        handleYearChange={handleYearChange}
                        listYears={listYears} />
                </div>
                <div className="">
                    <TerritorySelector
                        selectedTerritory={territory}
                        handleTerritoryChange={handleTerritoryChange}
                        listTerritories={listTerritories} />
                </div>
                {/* end filter */}
            </div>
            <ScrollArea className='w-100 h-[75lvh]'>
                <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                        <PM25 pm25Data={pm25Data} />
                    </div>
                    <div className="col-span-2">
                        {/* grafik penyakit */}

                        <DiseaseDevelopment
                            data={penyakitData}
                            globalYear={year}
                            globalTerritory={territory}
                        />
                    </div>
                    <div className="col-span-2">
                        {/* grafik ekonomi */}
                        <GeneralCardGraphWithVariableSelector
                            title="Economic Development"
                            data={ekonomiData}
                            globalYear={year}
                            globalTerritory={territory} />
                    </div>
                    <div className="col-span-2">
                        {/* grafik sosial */}
                        <GeneralCardGraphWithVariableSelector
                            title="Social Development"
                            data={sosialData}
                            globalYear={year}
                            globalTerritory={territory}
                        />
                    </div>

                    <div className="col-span-2">
                        <WargaChart
                            data={wargaData}
                            globalTerritory={territory}
                            globalYear={year} />
                    </div>
                </div >
            </ScrollArea>
        </>
    )
}
