import axios from 'axios';
import { CountryStats, WorldBankResponse, DataEntry, AllIndicator, IndicatorsListResponse } from '../types/countryModel';
import indicatorsMap from './indicatorsMap.json';
import * as allIndicatorsMap from './all_indicators.json';

type IndicatorsMap = { [principal: string]: { [indicatorCode: string]: string } };


const parsedIndicatorsMap: IndicatorsMap = indicatorsMap;


/**
 * Fetches data for multiple indicators for a given country.
 * @param country - The 3-letter country code.
 * @returns A promise that resolves to CountryStats.
 */
export const fetchCountrySummary = async (country: string): Promise<CountryStats> => {
    const principalIndicators = Object.keys(parsedIndicatorsMap);

    let countryName = '';
    let countryCode = '';
    const failedIndicatorsList: { principal: string; indicators: string[] }[] = [];

    const fetchIndicator = async (principal: string, indicator: string): Promise<DataEntry[]> => {
        try {
            const response = await axios.get(`https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=100`);

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error(`Invalid response structure for indicator ${indicator}`);
            }

            if (response.data.length < 2) {
                throw new Error(`Incomplete response for indicator ${indicator}`);
            }

            const [, data]: [WorldBankResponse, DataEntry[]] = response.data as [WorldBankResponse, DataEntry[]];

            // Extract country information from the first valid entry
            if (!countryName && data.length > 0) {
                const firstValidEntry = data.find(entry => entry.value !== null);
                if (firstValidEntry) {
                    countryName = firstValidEntry.country.value;
                    countryCode = firstValidEntry.countryiso3code;
                }
            }

            return data;
        } catch (error: any) {
            throw new Error(`Failed to fetch indicator ${indicator}: ${error.message}`);
        }
    };

    try {
        const results = await Promise.all(
            principalIndicators.map(async (principal) => {
                const indicators = parsedIndicatorsMap[principal];

                if (Object.keys(indicators).length === 0) {
                    return { principal, data: {} };
                }

                const indicatorEntries = Object.entries(indicators);
                const dataPromises = indicatorEntries.map(([indicatorCode, _]) => fetchIndicator(principal, indicatorCode));
                const settledResults = await Promise.allSettled(dataPromises);

                const indicatorData: { [indicatorCode: string]: { name: string; data: { year: string; value: number }[] } } = {};
                const failedIndicators: string[] = [];

                indicatorEntries.forEach(([indicatorCode, indicatorName], index) => {
                    const result = settledResults[index];
                    if (result.status === 'fulfilled') {
                        const dataEntries = result.value
                            .filter(entry => entry.value !== null)
                            .map(entry => ({
                                year: entry.date,
                                value: entry.value as number
                            }));
                        if (dataEntries.length > 0) {
                            indicatorData[indicatorCode] = {
                                name: indicatorName,
                                data: dataEntries
                            };
                        }
                    } else {
                        failedIndicators.push(indicatorCode);
                    }
                });

                if (failedIndicators.length > 0) {
                    failedIndicatorsList.push({ principal, indicators: failedIndicators });
                }

                return { principal, data: indicatorData };
            })
        );

        const organizedData: { [principal: string]: { [indicatorCode: string]: { name: string; data: { year: string; value: number }[] } } } = {};

        results.forEach(result => {
            organizedData[result.principal] = result.data;
        });

        if (!countryName || !countryCode) {
            throw new Error('Country information could not be retrieved.');
        }

        return {
            country: countryName,
            countryCode: countryCode,
            indicators: organizedData,
            failedIndicators: failedIndicatorsList
        };
    } catch (error: any) {
        throw new Error(`Failed to fetch country data: ${error.message}`);
    }
};



/**
 * Fetches data for a single indicator for a given country.
 * @param country - The 3-letter country code.
 * @param indicator - The indicator code.
 * @returns A promise that resolves to an array of DataEntry.
 * @throws Will throw an error if the fetch fails or the response is invalid.
 */
export const fetchSingleIndicator = async (country: string, indicator: string): Promise<DataEntry[]> => {
    try {
        const response = await axios.get(`https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=100`);

        if (!response.data || !Array.isArray(response.data)) {
            throw new Error(`Invalid response structure for indicator ${indicator}`);
        }

        if (response.data.length < 2) {
            throw new Error(`Incomplete response for indicator ${indicator}`);
        }

        const [, data]: [WorldBankResponse, DataEntry[]] = response.data as [WorldBankResponse, DataEntry[]];

        return data;
    } catch (error: any) {
        throw new Error(`Failed to fetch indicator ${indicator}: ${error.message}`);
    }
};



/**
 * Fetches all indicators from the World Bank API.
 * @returns A promise that resolves to an array of indicators with id, name, sourceOrganization, and sourceNote.
 * @throws Will throw an error if fetching fails.
 */
export const get_all_indicators = async (): Promise<AllIndicator[]> => {
    // const baseUrl = 'https://api.worldbank.org/v2/indicator';

    try {
        let allIndicators: AllIndicator[] = allIndicatorsMap as AllIndicator[];
        return allIndicators;
    } catch (error: any) {
        throw new Error(`Failed to fetch all indicators: ${error.message}`);
    }
};