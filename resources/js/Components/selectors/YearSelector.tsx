import { GenericSelector } from "@/Components/ui/GenericSelector";

export const YearSelector = ({
    listYears,
    selectedYear,
    handleYearChange,
}: {
    listYears: string[]; // Change to string[] for proper type
    selectedYear: string;
    handleYearChange: (year: string | null) => void;
}) => {

    return (
        <GenericSelector
            items={listYears}
            selectedItem={selectedYear}
            onSelectItem={handleYearChange}
            placeholder="Select Year"
        />
    );
};
