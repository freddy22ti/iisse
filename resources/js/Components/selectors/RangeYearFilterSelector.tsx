import { useEffect } from "react"
import { YearSelector } from "./YearSelector"
import { toast } from "sonner"

interface RangeYearFilterSelectorProps {
    fromYear: string
    toYear: string
    setFromYear: (year: string) => void
    setToYear: (year: string) => void
    listYears: string[]
}

export const RangeYearFilterSelector = ({
    fromYear,
    toYear,
    setFromYear,
    setToYear,
    listYears
}: RangeYearFilterSelectorProps) => {
    useEffect(() => {
        if (fromYear && toYear) {
            const from = parseInt(fromYear, 10);
            const to = parseInt(toYear, 10);

            if (!isNaN(from) && !isNaN(to)) {
                if (to - from > 10) {
                    toast.error("Rentang tahun tidak boleh melebihi 10 tahun.");
                } else if (to < from) {
                    toast.error("Tahun mulai harus lebih besar dari tahun hingga.");
                }
            }
        }
    }, [fromYear, toYear])
    
    return (
        <div className="flex space-x-4">
            <div className="space-y-1">
                <div className="text-xs">From the year</div>
                <YearSelector
                    selectedYear={fromYear}
                    handleYearChange={
                        (year: string | null) => setFromYear(year ?? "")}
                    listYears={listYears}
                />
            </div>
            <div className="space-y-1">
                <div className="text-xs">Until the year</div>
                <YearSelector
                    selectedYear={toYear}
                    handleYearChange={
                        (year: string | null) => setToYear(year ?? "")}
                    listYears={listYears}
                />
            </div>
        </div>
    )
}