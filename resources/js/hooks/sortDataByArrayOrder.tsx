import { ekonomiColumns, sosialColumns, demografiColumns } from "@/lib/sortData";
import { getLegendData } from "@/lib/utils";
import { useMemo } from "react";

// Define types for the hook
type LegendData = string[]; // Legend data is an array of strings
type Columns = {
    [key: string]: string[] | null; // Keys map to arrays of strings or null
};

// Known titles
const validTitles = ["Ekonomi", "Sosial", "Demografi"] as const;
type Title = (typeof validTitles)[number];

const sortDataByArrayOrder = (data: string[], orderArray: string[] | null): string[] => {
    if (!orderArray) return data;

    return data.sort((a, b) => {
        // Convert orderArray to lowercase for comparison
        const lowerOrderArray = orderArray.map((item) => item.toLowerCase());
        
        // Find indices in lower-case version of orderArray
        const indexA = lowerOrderArray.indexOf(a.toLowerCase());
        const indexB = lowerOrderArray.indexOf(b.toLowerCase());

        // If item is not found in orderArray, place it at the end
        const adjustedIndexA = indexA === -1 ? Infinity : indexA;
        const adjustedIndexB = indexB === -1 ? Infinity : indexB;

        return adjustedIndexA - adjustedIndexB;
    });
};

const getColumnsObject = (title: string): Columns | null => {
    if (title.includes("Economic")) {
        return ekonomiColumns;
    } else if (title.includes("Social")) {
        return sosialColumns;
    } else if (title.includes("Demography")) {

        return demografiColumns;
    } else {
        return null; // Return null for unknown titles
    }
};

const useSortedLegendData = (
    processedData: any, // Replace with a more specific type if applicable
    title: string, // Allow any string as title
    selectedVariable: string
): LegendData => {
    return useMemo(() => {
        const columns = getColumnsObject(title);

        if (!columns) {
            console.warn(`Unknown title: ${title}`); // Warn for unsupported titles
            return [];
        }

        const orderArray = columns[selectedVariable] || null;

        // Fetch legend data and sort it
        const legendData = getLegendData(processedData, "kecamatan") as LegendData;
        
        const result = sortDataByArrayOrder(legendData, orderArray);


        return result
    }, [processedData, title, selectedVariable]);
};

export default useSortedLegendData;
