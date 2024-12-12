export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    country: string;
    city: string;
    address: string;
    postal_code: string;
    profile_picture: string;
    role?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    appName: string;
    auth: {
        user: User;
    };
    [key: string];
};

export interface PM25DataProps {
    tanggal: string;
    titik: string;
    rata_rata_nilai: number;
}

export interface PM25SummaryProps {
    id: number
    tahun: string
    rata_rata_pm25: number
    kecamatan: string
}

export interface GeneralDataProps {
    columns: string[];
    listTerritories: string[];
    listYears: string[];
    data: any[];
}
