export interface WorldBankResponse {
    page: number;
    pages: number;
    per_page: string;
    total: number;
    sourceid: string;
    lastupdated: string;
}

export interface Indicator {
    id: string;
    value: string;
}

export interface Country {
    id: string;
    value: string;
}

export interface DataEntry {
    indicator: Indicator;
    country: Country;
    countryiso3code: string;
    date: string;
    value: number | null;
    unit: string;
    obs_status: string;
    decimal: number;
}

export interface CountryStats {
    country: string;
    countryCode: string;
    indicators: {
        [principal: string]: {
            [indicatorCode: string]: {
                name: string;
                data: {
                    year: string;
                    value: number;
                }[];
            };
        };
    };
    failedIndicators: {
        principal: string;
        indicators: string[];
    }[];
}

export interface IndicatorStats {
    country: string;
    countryCode: string;
    indicatorCode: string;
    indicatorName: string;
    data: {
        year: string;
        value: number;
    }[];
}

export interface ApiIndicator {
    id: string;
    name: string;
    unit: string;
    source: {
        id: string;
        value: string;
    };
    sourceNote: string;
    sourceOrganization: string;
    topics: Array<{
        id: string;
        value: string;
    }>;
}

export interface IndicatorsAPIResponse {
    page: number;
    pages: number;
    per_page: string;
    total: number;
}

export type IndicatorsListResponse = [IndicatorsAPIResponse, ApiIndicator[]];

export interface AllIndicator {
    id: string;
    name: string;
    sourceOrganization: string;
    sourceNote: string;
}



export type country3letterCode = (country: string) => string[];