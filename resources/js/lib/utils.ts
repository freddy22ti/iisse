import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/* CUSTOM FUNCTION */

// Fungsi yang berfungsi untuk replace _ menjadi spasi
export const formatColumnName = (oldColumnName: string) => {
    return oldColumnName.replace(/_/g, " ");
};

// Fungsi yang berfungsi untuk dapatkan kategori unik
export const getLegendData = (
    chartData: any[], // Allow null for chartData
    filterKey: string // Allow null for filterKey
): string[] => {
    if (!chartData || !filterKey) {
        return []; // Return an empty array if chartData or filterKey is null
    }

    const legendData = chartData.reduce((acc, item) => {
        if (item && typeof item === 'object') { // Ensure item is an object before iterating
            Object.keys(item).forEach((key) => {
                // Exclude filterKey or handle if the value is null
                if (key !== filterKey && key !== 'null') {
                    acc.add(key);
                }
            });
        }
        return acc;
    }, new Set<string>());

    return Array.from(legendData);
};


// Fungsi untuk mendapatkan tahun terbaru
export const getLatestYear = (listYears: string[]) => {
    const latestYear = Math.max(...listYears.map((item) => parseInt(item)));
    return latestYear.toString();
};


// Fungsi untuk menambahkan atribut waktu di data
export const addWaktuAttribute = (data: any[]) => {
    return data.map((item) => {
        if (!item.hasOwnProperty('tahun') && item.waktu) {
            return {
                ...item,
                tahun: new Date(item.waktu).getFullYear(),
            };
        }
        return item;
    });
};


// Fungsi untuk fiter data berdasarkan tahun dan kategori
export const filterDataByYearAndTerritory = (
    data: any[],
    year: string | null,
    territory: string | null
) => {
    return data.filter(
        (item) =>
            (!year || item.tahun == year) &&
            (!territory || item.kecamatan === territory)
    );
};

export const filterDataByRangeYearAndTerritory = (
    data: any[],
    fromYear: string,
    toYear: string,
    territory: string
) => {
    return data.filter(
        (item) =>
            (fromYear ? String(item.tahun) >= fromYear : true) &&
            (toYear ? String(item.tahun) <= toYear : true) &&
            (territory ? item.kecamatan === territory : true)
    );
};

