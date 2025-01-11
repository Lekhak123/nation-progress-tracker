import { fetchCountrySummary, fetchSingleIndicator, get_all_indicators } from '../utils/apiHelper';
import { CountryStats, country3letterCode, IndicatorStats } from '../types/countryModel';
import countryCodes from '../utils/ISO_3166-1_alpha-3_codes.json';

interface CountryCodeEntry {
    name: string;
    code: string;
}

/**
 * Retrieves the 3-letter country codes for a given country name.
 * Returns an array of matching country codes. If no matches are found, returns an empty array.
 * @param country - The name of the country.
 * @returns An array of 3-letter country codes.
 */
export const get_country3letterCode: country3letterCode = (country: string): string[] => {
    const lowerCaseCountry = country.toLowerCase().trim();

    const matches = countryCodes
        .filter((c: CountryCodeEntry) => c.name.toLowerCase().includes(lowerCaseCountry))
        .slice(0, 5) // Limit to first 5 matches to prevent excessive results
        .map((c: CountryCodeEntry) => c.code);

    return matches;
};

/**
 * Retrieves statistics for a given 3-letter country code.
 * @param countryCode - The 3-letter country code.
 * @returns A Promise that resolves to CountryStats.
 * @throws Will throw an error if the country code is invalid or if data fetching fails.
 */
export const getCountryStats = async (countryCode: string): Promise<CountryStats> => {
    const upperCaseCode = countryCode.toUpperCase().trim();

    // Verify if the country code exists in the countryCodes JSON
    const isValidCode = countryCodes.some((c: CountryCodeEntry) => c.code === upperCaseCode);

    if (!isValidCode) {
        throw new Error(`Invalid country code "${countryCode}". Please provide a valid 3-letter country code.`);
    }

    try {
        const data = await fetchCountrySummary(upperCaseCode);
        return data;
    } catch (error: any) {
        throw new Error(`Failed to retrieve country stats for code "${countryCode}": ${error.message}`);
    }
};




/**
 * Retrieves data for a specific indicator for a given 3-letter country code.
 * @param countryCode - The 3-letter country code.
 * @param indicatorCode - The indicator code.
 * @returns A Promise that resolves to IndicatorStats.
 * @throws Will throw an error if the country code or indicator code is invalid or if data fetching fails.
 */
export const getIndicatorStats = async (
    countryCode: string,
    indicatorCode: string
): Promise<IndicatorStats> => {
    const upperCaseCode = countryCode.toUpperCase().trim();
    const trimmedIndicatorCode = indicatorCode.trim();

    // Verify if the country code exists in the countryCodes JSON
    const countryEntry = countryCodes.find((c: CountryCodeEntry) => c.code === upperCaseCode);

    if (!countryEntry) {
        throw new Error(`Invalid country code "${countryCode}". Please provide a valid 3-letter country code.`);
    }

    try {
        const dataEntries = await fetchSingleIndicator(upperCaseCode, trimmedIndicatorCode);

        if (dataEntries.length === 0) {
            throw new Error(`No data available for indicator "${indicatorCode}" in country "${countryCode}".`);
        }

        // Extract the indicator name from the first valid entry
        const firstValidEntry = dataEntries.find(entry => entry.value !== null);

        if (!firstValidEntry || !firstValidEntry.indicator.value) {
            throw new Error(`Indicator "${indicatorCode}" does not have a valid name in the API response.`);
        }

        const indicatorName = firstValidEntry.indicator.value;

        // Process the data entries to extract year and value, filtering out null values
        const processedData = dataEntries
            .filter(entry => entry.value !== null)
            .map(entry => ({
                year: entry.date,
                value: entry.value as number,
            }))
            .sort((a, b) => Number(a.year) - Number(b.year)); // Sort data by year ascending

        if (processedData.length === 0) {
            throw new Error(`No valid data available for indicator "${indicatorCode}" in country "${countryCode}".`);
        }

        return {
            country: countryEntry.name,
            countryCode: countryEntry.code,
            indicatorCode: trimmedIndicatorCode,
            indicatorName,
            data: processedData,
        };
    } catch (error: any) {
        throw new Error(`Failed to retrieve indicator "${indicatorCode}" for country "${countryCode}": ${error.message}`);
    }
};


export {get_all_indicators};