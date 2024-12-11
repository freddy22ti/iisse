import { GenericSelector } from "@/Components/ui/GenericSelector";

export const TerritorySelector = (
    {
        listTerritories,
        selectedTerritory,
        handleTerritoryChange,
    }: {
        listTerritories: string[],
        selectedTerritory: string;
        handleTerritoryChange: (territory: string | null) => void;
    }) => {

    return (
        <GenericSelector
            items={listTerritories}
            selectedItem={selectedTerritory}
            onSelectItem={handleTerritoryChange}
            placeholder="Select Territory"
        />
    );
};
