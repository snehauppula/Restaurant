'use client';

import React, { useState } from 'react';
import { Link2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SheetConfigProps {
    onSheetUrlSubmit: (url: string) => void;
    isLoading: boolean;
    currentSheetUrl?: string;
}

export default function SheetConfig({ onSheetUrlSubmit, isLoading, currentSheetUrl }: SheetConfigProps) {
    const [sheetUrl, setSheetUrl] = useState(currentSheetUrl || '');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!sheetUrl.trim()) {
            setError('Please enter a Google Sheets URL');
            return;
        }

        onSheetUrlSubmit(sheetUrl.trim());
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-premium p-8">
                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl mb-4">
                        <Link2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Connect Your Google Sheet
                    </h2>
                    <p className="text-gray-600">
                        Enter your Google Sheets URL to fetch and visualize your sales data
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sheet-url" className="block text-sm font-medium text-gray-700 mb-2">
                            Google Sheets URL
                        </label>
                        <input
                            type="text"
                            id="sheet-url"
                            value={sheetUrl}
                            onChange={(e) => setSheetUrl(e.target.value)}
                            placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/..."
                            className="
                w-full px-4 py-3 border-2 border-gray-300 rounded-xl
                focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                transition-all duration-200
              "
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
              w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 
              text-white rounded-xl font-medium
              hover:from-primary-700 hover:to-purple-700 
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 transition-all duration-200
              shadow-md hover:shadow-lg
              flex items-center justify-center gap-2
            "
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Loading Data...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Load Dashboard
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2 text-sm">
                        📝 Important Notes:
                    </h3>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                        <li>Your Google Sheet must be publicly accessible (Anyone with the link can view)</li>
                        <li>Required columns: Date, Time, Order_ID, Item_Name, Category, Quantity, Unit_Price, Total_Amount</li>
                        <li>Data refreshes automatically when you reload the dashboard</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
