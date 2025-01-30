
# Country Stats Package

![License](https://img.shields.io/npm/l/nation-progress-tracker)
![Version](https://img.shields.io/npm/v/nation-progress-tracker)
![Downloads](https://img.shields.io/npm/dm/nation-progress-tracker)

This package is a Node.js wrapper for the World Bank API, allowing users to easily fetch and manage country-specific statistics. It provides access to a wide range of indicators across sectors like economic, education, health, social development, and more.

This package enables users to track a nation's development progress over time, offering valuable insights for holding governments accountable, particularly in developing and underdeveloped countries. By leveraging data from the World Bank, it helps highlight areas of improvement and transparency. Users can look up any specific indicators listed by the [World Bank](https://data.worldbank.org/indicator).

## Table of Contents

- [Country Stats Package](#country-stats-package)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Functions](#functions)
    - [getCountryStats](#getcountrystats)
    - [getIndicatorStats](#getindicatorstats)
    - [get\_all\_indicators](#get_all_indicators)
    - [get\_country3letterCode](#get_country3lettercode)
  - [Usage Example](#usage-example)
    - [Using with Express.js](#using-with-expressjs)
  - [API Documentation](#api-documentation)
    - [getCountryStats(country: string): Promise](#getcountrystatscountry-string-promise)
    - [getIndicatorStats(country: string, indicator: string): Promise\<DataEntry\[\]\>](#getindicatorstatscountry-string-indicator-string-promisedataentry)
    - [get\_all\_indicators(): Promise\<AllIndicator\[\]\>](#get_all_indicators-promiseallindicator)
    - [get\_country3letterCode(countryName: string): Promise\<string\[\]\>](#get_country3lettercodecountryname-string-promisestring)
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

### getCountryStats

Fetches comprehensive statistics for a given 3-letter country code.

**Parameters:**
- country (_string_): The 3-letter ISO country code (e.g., "NPL", "CAN").

**Returns:**
- Promise<CountryStats>: A promise that resolves to an object containing country statistics.

### getIndicatorStats

Fetches data for a specific indicator for a given country.

**Parameters:**
- country (_string_): The 3-letter ISO country code (e.g., "NPL", "CAN").
- indicator (_string_): The indicator code (e.g., "NY.GDP.MKTP.CD").

**Returns:**
- Promise<DataEntry[]>: A promise that resolves to an array of data entries.

### get_all_indicators

Fetches all available indicators from the World Bank API.

**Parameters:**
- None

**Returns:**
- Promise<AllIndicator[]>: A promise that resolves to an array of indicators.

**Note:** This API may take significant time to execute as it needs to scrape hundreds of pages of results.

### get_country3letterCode

Fetches the 3-letter country code for a given country name.

**Parameters:**
- countryName (_string_): The name of the country (e.g., "Nepal", "Canada").

**Returns:**
- Promise<string[]>: A promise that resolves to an array of 3-letter country codes.

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
import { getCountryStats, getIndicatorStats, get_all_indicators, get_country3letterCode } from 'nation-progress-tracker';

const app: Express = express();
const port: number = 3000;
app.use(express.json());

app.get('/country-code/:countryName', async (req: Request, res: Response): Promise<void> => {
    const countryName: string = req.params.countryName.trim();
    try {
        const codes: string[] = await get_country3letterCode(countryName);
        if (codes.length === 0) {
            res.status(404).json({ message: `No country codes found for "${countryName}".` });
            return;
        }
        res.json({ codes });
    } catch (error: any) {
        console.error(`Error fetching country codes for ${countryName}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch country codes' });
    }
});

app.get('/country-stats/:country', async (req: Request, res: Response): Promise<void> => {
    const country = req.params.country.toUpperCase().trim();
    try {
        const data = await getCountryStats(country);
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
        const data = await getIndicatorStats(country, indicator);
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

### getCountryStats(country: string): Promise<CountryStats>

Fetches comprehensive statistics for a specified country.

**Parameters:**
- country: A 3-letter ISO country code (e.g., "NPL", "CAN").

**Returns:**
- A promise that resolves to a `CountryStats` object containing detailed statistics.

**Example Response:**

```json
{
  "country": "Nepal",
  "countryCode": "NPL",
  "indicators": {
    "Economic Indicators": {
      "NY.GDP.MKTP.CD": {
        "name": "GDP (current US dollars)",
        "data": [
          { "year": "2020", "value": 35000000000 },
          { "year": "2021", "value": 36000000000 }
        ]
      }
    },
    "Social Indicators": {
      "SP.POP.TOTL": {
        "name": "Population, total",
        "data": [
          { "year": "2020", "value": 30000000 },
          { "year": "2021", "value": 30500000 }
        ]
      }
    }
  }
}
```

### getIndicatorStats(country: string, indicator: string): Promise<DataEntry[]>

Fetches data for a specific indicator within a given country.

**Parameters:**
- country: A 3-letter ISO country code (e.g., "NPL", "CAN").
- indicator: The indicator code (e.g., "NY.GDP.MKTP.CD").

**Returns:**
- A promise that resolves to an array of `DataEntry`.

**Example Response:**

```json
{
  "country": "Nepal",
  "countryCode": "NPL",
  "indicatorCode": "NE.IMP.GNFS.ZS",
  "indicatorName": "Imports of goods and services (% of GDP)",
  "data": [
    { "year": "2020", "value": 23.5 },
    { "year": "2021", "value": 24.2 }
  ]
}
```

### get_all_indicators(): Promise<AllIndicator[]>

Fetches all available indicators from the World Bank API.

**Returns:**
- A promise that resolves to an array of `AllIndicator`.

**Example Response:**

```json
[
  {
    "id": "SP.POP.TOTL",
    "name": "Population, total",
    "sourceOrganization": "World Bank",
    "sourceNote": "World Bank data"
  },
  {
    "id": "NY.GDP.MKTP.CD",
    "name": "GDP (current US dollars)",
    "sourceOrganization": "World Bank",
    "sourceNote": "World Bank data"
  }
]
```

**Note:** This API may take significant time to execute as it scrapes hundreds of pages of results.

### get_country3letterCode(countryName: string): Promise<string[]>

Fetches the 3-letter country code for a given country

 name.

**Parameters:**
- countryName: The name of the country (e.g., "Nepal", "Canada").

**Returns:**
- A promise that resolves to an array of 3-letter country codes.

**Example Response:**

```json
{
  "codes": ["NPL"]
}
```

## Contributing

Contributions are welcome! Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License.
