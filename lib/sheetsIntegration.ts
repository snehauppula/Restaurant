// Google Sheets Integration
// Fetches data directly from a public Google Sheets document

import { parse } from 'papaparse';
import type { SalesRecord } from './types';

/**
 * Converts a Google Sheets URL to a CSV export URL
 * @param sheetUrl - The Google Sheets URL
 * @returns CSV export URL
 */
export function getSheetCSVUrl(sheetUrl: string): string {
    // Extract the sheet ID from various Google Sheets URL formats
    const patterns = [
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        /\/d\/([a-zA-Z0-9-_]+)/,
    ];

    for (const pattern of patterns) {
        const match = sheetUrl.match(pattern);
        if (match && match[1]) {
            const sheetId = match[1];
            return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }
    }

    // If already a CSV export URL or direct sheet ID
    if (sheetUrl.includes('export?format=csv')) {
        return sheetUrl;
    }

    // Assume it's a sheet ID
    return `https://docs.google.com/spreadsheets/d/${sheetUrl}/export?format=csv`;
}

/**
 * Fetches data from Google Sheets
 * @param sheetUrl - Google Sheets URL or ID
 * @returns Promise resolving to sales records
 */
export async function fetchSheetData(sheetUrl: string): Promise<SalesRecord[]> {
    const csvUrl = getSheetCSVUrl(sheetUrl);

    try {
        const response = await fetch(csvUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }

        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        const records: SalesRecord[] = results.data.map((row: any) => ({
                            date: row.Date?.trim() || '',
                            time: row.Time?.trim() || '',
                            orderId: row.Order_ID?.trim() || '',
                            itemName: row.Item_Name?.trim() || '',
                            category: row.Category?.trim() || '',
                            quantity: parseInt(row.Quantity) || 0,
                            unitPrice: parseFloat(row.Unit_Price) || 0,
                            totalAmount: parseFloat(row.Total_Amount) || 0,
                        }));
                        resolve(records.filter(r => r.orderId && r.totalAmount > 0));
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error: Error) => {
                    reject(error);
                },
            });
        });
    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        throw error;
    }
}

/**
 * Validates if a Google Sheets URL is in correct format
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidSheetUrl(url: string): boolean {
    if (!url) return false;

    // Check for Google Sheets URL patterns
    const patterns = [
        /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/,
        /^[a-zA-Z0-9-_]{25,}$/, // Just the sheet ID
    ];

    return patterns.some(pattern => pattern.test(url));
}
