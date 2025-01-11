# Country Stats Package

![License](https://img.shields.io/npm/l/nation-progress-tracker)
![Version](https://img.shields.io/npm/v/nation-progress-tracker)
![Downloads](https://img.shields.io/npm/dm/nation-progress-tracker)

This package is a Node.js wrapper for the World Bank API, allowing users to easily fetch and manage country-specific statistics. It provides access to a wide range of indicators across sectors like economic, education, health, social development, and more.

This package enables users to track a nation's development progress over time, offering valuable insights for holding governments accountable, particularly in developing and underdeveloped countries. By leveraging data from the World Bank, it helps highlight areas of improvement and transparency. Users can look up any specific indicators listed by the [World Bank](https://data.worldbank.org/indicator)


## Table of Contents

- [Country Stats Package](#country-stats-package)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Functions](#functions)
    - [fetchCountrySummary](#fetchcountrysummary)
    - [fetchSingleIndicator](#fetchsingleindicator)
    - [get\_all\_indicators](#get_all_indicators)
  - [Usage Example](#usage-example)
    - [Using with Express.js](#using-with-expressjs)
  - [API Documentation](#api-documentation)
    - [fetchCountrySummary(country: string): Promise](#fetchcountrysummarycountry-string-promise)
    - [fetchSingleIndicator(country: string, indicator: string): Promise\<DataEntry\[\]\>](#fetchsingleindicatorcountry-string-indicator-string-promisedataentry)
    - [get\_all\_indicators(): Promise\<AllIndicator\[\]\>](#get_all_indicators-promiseallindicator)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

Install the package via npm:

```bash
npm install nation-progress-tracker
```

Or using yarn:

```bash
yarn add nation-progress-tracker
```

## Functions

### fetchCountrySummary

Fetches comprehensive statistics for a given 3-letter country code.

**Parameters:**
- `country` (_string_): The 3-letter ISO country code (e.g., "NPL", "CAN").

**Returns:**
- `Promise<CountryStats>`: A promise that resolves to an object containing country statistics.

**Return Type Example:**
```typescript
interface CountryStats {
    country: string; // Country name
    countryCode: string; // ISO-3 country code
    indicators: {
        [principal: string]: {
            [indicatorCode: string]: {
                name: string; // Indicator name
                data: { year: string; value: number }[]; // Yearly data for the indicator
            };
        };
    };
    failedIndicators: {
        principal: string; // Principal category name
        indicators: string[]; // List of failed indicator codes
    }[];
}
```

**Example:**

```typescript
import { fetchCountrySummary } from 'nation-progress-tracker';

(async () => {
    try {
        const stats = await fetchCountrySummary('NPL');
        console.log(stats);
    } catch (error) {
        console.error(error.message);
    }
})();
```

### fetchSingleIndicator

Fetches data for a specific indicator for a given country.

**Parameters:**
- `country` (_string_): The 3-letter ISO country code (e.g., "NPL", "CAN").
- `indicator` (_string_): The indicator code (e.g., "NY.GDP.MKTP.CD").

**Returns:**
- `Promise<DataEntry[]>`: A promise that resolves to an array of data entries.

**Return Type Example:**
```typescript
interface DataEntry {
    indicator: Indicator; // Indicator information
    country: Country; // Country information
    countryiso3code: string; // ISO-3 country code
    date: string; // Year of the data entry
    value: number | null; // Data value or null if unavailable
    unit: string; // Unit of the data
    obs_status: string; // Observation status
    decimal: number; // Decimal places for the value
}
```

**Example:**

```typescript
import { fetchSingleIndicator } from 'nation-progress-tracker';

(async () => {
    try {
        const indicatorStats = await fetchSingleIndicator('NPL', 'NY.GDP.MKTP.CD');
        console.log(indicatorStats);
    } catch (error) {
        console.error(error.message);
    }
})();
```

### get_all_indicators

Fetches all available indicators from the World Bank API.

**Parameters:**
- None

**Returns:**
- `Promise<AllIndicator[]>`: A promise that resolves to an array of indicators.

**Return Type Example:**
```typescript
interface AllIndicator {
    id: string; // Indicator ID
    name: string; // Indicator name
    sourceOrganization: string; // Organization providing the source
    sourceNote: string; // Additional notes regarding the source
}
```

**Example:**

```typescript
import { get_all_indicators } from 'nation-progress-tracker';

(async () => {
    try {
        const indicators = await get_all_indicators();
        console.log(indicators);
    } catch (error) {
        console.error(error.message);
    }
})();
```

## Usage Example

### Using with Express.js

Integrate the package with an Express.js server to create API endpoints for fetching country statistics and indicators.

**Installation:**

Ensure Express is installed in your project:

```bash
npm install express
```

**Example `index.ts`:**

```typescript
import express, { Express, Request, Response } from 'express';
import { fetchCountrySummary, fetchSingleIndicator, get_all_indicators } from 'nation-progress-tracker';

const app: Express = express();
const port: number = 3000;
app.use(express.json());

app.get('/nation-progress-tracker/:country', async (req: Request, res: Response): Promise<void> => {
    const country = req.params.country.toUpperCase().trim();
    try {
        const data = await fetchCountrySummary(country);
        res.json(data);
    } catch (error: any) {
        console.error(`Error fetching country stats for ${country}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/indicator-stats/:country/:indicator', async (req: Request, res: Response): Promise<void> => {
    const country = req.params.country.toUpperCase().trim();
    const indicator = req.params.indicator.trim();
    try {
        const data = await fetchSingleIndicator(country, indicator);
        res.json(data);
    } catch (error: any) {
        console.error(`Error fetching indicator stats for ${country}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/all-indicators', async (_req: Request, res: Response): Promise<void> => {
    try {
        const data = await get_all_indicators();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching all indicators:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, (): void => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

## API Documentation

### fetchCountrySummary(country: string): Promise<CountryStats>

Fetches comprehensive statistics for a specified country.

**Parameters:**
- `country`: A 3-letter ISO country code (e.g., "NPL", "CAN").

**Returns:**
- A promise that resolves to a `CountryStats` object containing detailed statistics.

**Example:**

```typescript
const stats = await fetchCountrySummary('NPL');
console.log(stats);
```

### fetchSingleIndicator(country: string, indicator: string): Promise<DataEntry[]>

Fetches data for a specific indicator within a given country.

**Parameters:**
- `country`: A 3-letter ISO country code (e.g., "NPL", "CAN").
- `indicator`: The indicator code (e.g., "NY.GDP.MKTP.CD").

**Returns:**
- A promise that resolves to an array of `DataEntry`.

**Example:**

```typescript
const indicatorStats = await fetchSingleIndicator('NPL', 'NY.GDP.MKTP.CD');
console.log(indicatorStats);
```

### get_all_indicators(): Promise<AllIndicator[]>

Fetches all available indicators from the World Bank API.

**Returns:**
- A promise that resolves to an array of `AllIndicator`.

**Example:**

```typescript
const indicators = await get_all_indicators();
console.log(indicators);
```

## Contributing

Contributions are welcome!
Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License.