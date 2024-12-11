// Fungsi untuk menghitung dan mengelompokkan data berdasarkan variabel tertentu
export const countAndGroup = (
    data: any[],
    variable: string,
    groupVariable: string,
    groupVariable2?: string
) => {
    type CountsType = Record<
        string,
        Record<string, number> | Record<string, Record<string, number>>
    >;

    const processedData: Array<Record<string, any>> = [];
    const counts: CountsType = {};

    data.forEach((item) => {
        const xValue = item[groupVariable] ?? "Unknown"; // Default to "Pekanbaru" if undefined
        const yValue = groupVariable2 ? item[groupVariable2] ?? "Unknown" : null; // Handle optional second grouping
        const variableValue = item[variable]; // The value being counted

        // Initialize the counts structure for xValue
        if (!counts[xValue]) {
            counts[xValue] = groupVariable2 ? {} : {};
        }

        if (groupVariable2 && yValue !== null) {
            // Nested structure for groupVariable2
            const group2Counts = counts[xValue] as Record<string, Record<string, number>>;

            if (!group2Counts[yValue]) {
                group2Counts[yValue] = {};
            }

            if (!group2Counts[yValue][variableValue]) {
                group2Counts[yValue][variableValue] = 0;
            }

            group2Counts[yValue][variableValue] += 1;
        } else {
            // Flat structure if groupVariable2 is not used
            const flatCounts = counts[xValue] as Record<string, number>;

            if (!flatCounts[variableValue]) {
                flatCounts[variableValue] = 0;
            }

            flatCounts[variableValue] += 1;
        }
    });

    // Convert counts to processedData format
    Object.entries(counts).forEach(([xValue, groups]) => {
        if (groupVariable2) {
            // Nested structure for groupVariable2
            Object.entries(groups as Record<string, Record<string, number>>).forEach(
                ([yValue, categories]) => {
                    const entry: Record<string, any> = {
                        [groupVariable]: xValue,
                        [groupVariable2]: yValue,
                    };

                    for (const [key, count] of Object.entries(categories)) {
                        entry[key] = count;
                    }

                    processedData.push(entry);
                }
            );
        } else {
            // Flat structure if groupVariable2 is not used
            const entry: Record<string, any> = { [groupVariable]: xValue };

            for (const [key, count] of Object.entries(groups as Record<string, number>)) {
                entry[key] = count;
            }

            processedData.push(entry);
        }
    });

    return processedData;
};


export const groupByYear = (data: any[], variable: string) => {
    return data.reduce((acc, item) => {
        const yearKey = item.tahun; // Key by year
        const existingItem = acc.find((entry: any) => entry.tahun === yearKey); // Check if the year already exists

        if (!existingItem) {
            // If the year doesn't exist, create a new object
            acc.push({ tahun: yearKey, [variable]: item[variable] }); // Initialize with the current item's variable value
        } else {
            // If the year exists, aggregate the variable
            existingItem[variable] += item[variable];
        }

        return acc; // Return the accumulator
    }, []); // Initialize as an array
};

export const groupByTerritory = (data: any[], variable: string) => {
    return data.reduce((acc, item) => {
        const kecamatanKey = item.kecamatan; // Key by year
        const existingItem = acc.find(
            (entry: any) => entry.kecamatan === kecamatanKey
        ); // Check if the year already exists

        if (!existingItem) {
            // If the year doesn't exist, create a new object
            acc.push({ kecamatan: kecamatanKey, [variable]: item[variable] }); // Initialize with the current item's variable value
        } else {
            // If the year exists, aggregate the variable
            existingItem[variable] += item[variable];
        }

        return acc; // Return the accumulator
    }, []); // Initialize as an array
};

// fungsi yang menghitung total nilai dari valueVariable yang dikelompokkan berdasarkan nilai variable1 dan variable2.
export const sumValueAndGroup = (
    data: any[],
    variable1: string,
    variable2: string,
    valueVariable: string,
    defaultValueVar1 = ""
) => {
    const result: { [key: string]: { [key: string]: number } } = {};
    const uniqueVariable: Set<string> = new Set();

    data.forEach((item) => {
        const key1 = item[variable1] ?? defaultValueVar1;
        const key2 = item[variable2];
        const value = item[valueVariable];

        if (!result[key1]) {
            result[key1] = {};
        }

        result[key1][key2] = (result[key1][key2] || 0) + value;
        uniqueVariable.add(key2);
    });

    const formattedData = Object.entries(result).map(([key1, key2Values]) => ({
        [variable1]: key1,
        ...key2Values,
    }));

    return { formattedData, uniqueVariable: Array.from(uniqueVariable) };
};
