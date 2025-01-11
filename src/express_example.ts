import express, { Express, Request, Response } from "express";
import { getCountryStats, get_country3letterCode, getIndicatorStats, get_all_indicators } from './services/countryService';

// Exporting the service functions for external use
export { getCountryStats, get_country3letterCode };

const app: Express = express();
const port: number = 3000;
app.use(express.json());



/**
 * Route: GET /country-stats/:countryCode
 * Description: Retrieves statistics for a given country code.
 */
app.get('/country-stats/:countryCode', async (req: Request, res: Response): Promise<void> => {
    const countryCode: string = req.params.countryCode.toUpperCase().trim();

    try {
        const data = await getCountryStats(countryCode);
        res.json(data);
    } catch (error: any) {
        console.error(`Error fetching country stats for ${countryCode}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});



/**
 * Route: GET /country-code/:countryName
 * Description: Retrieves the 3-letter country codes for a given country name.
 */
app.get('/country-code/:countryName', async (req: Request, res: Response): Promise<void> => {
    const countryName: string = req.params.countryName.trim();

    try {
        const codes: string[] = get_country3letterCode(countryName);

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



app.get('/indicator-stats/:countryCode/:indicatorCode', async (req: Request, res: Response): Promise<void> => {
    const countryCode: string = req.params.countryCode.toUpperCase().trim();
    const indicatorCode: string = req.params.indicatorCode.trim();

    try {
        const data = await getIndicatorStats(countryCode, indicatorCode);
        res.json(data);
    } catch (error: any) {
        console.error(`Error fetching indicator stats for ${indicatorCode} in ${countryCode}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});



app.get('/all-indicators', async (req: Request, res: Response): Promise<void> => {
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

