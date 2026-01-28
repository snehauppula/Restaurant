'use client';

import React, { useState } from 'react';
import { Link2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SheetConfigProps {
    onSheetUrlSubmit: (url: string, scriptUrl?: string) => void;
    isLoading: boolean;
    currentSheetUrl?: string;
    currentScriptUrl?: string;
}

export default function SheetConfig({ onSheetUrlSubmit, isLoading, currentSheetUrl, currentScriptUrl }: SheetConfigProps) {
    const [sheetUrl, setSheetUrl] = useState(currentSheetUrl || '');
    const [scriptUrl, setScriptUrl] = useState(currentScriptUrl || '');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!sheetUrl.trim()) {
            setError('Please enter a Google Sheets URL');
            return;
        }

        onSheetUrlSubmit(sheetUrl.trim(), scriptUrl.trim());
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-premium p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-[2rem] mb-6 shadow-lg shadow-primary-100">
                        <Link2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                        Dashboard Connectivity
                    </h2>
                    <p className="text-gray-500 font-medium">
                        Connect your live Google Sheet for real-time analytics
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="sheet-url" className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                1. Data Source URL (Read)
                            </label>
                            <input
                                type="text"
                                id="sheet-url"
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/d/YOUR_ID/..."
                                className="
                                    w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 
                                    rounded-2xl transition-all duration-300 outline-none font-bold text-gray-700
                                "
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="script-url" className="text-xs font-black text-purple-400 uppercase tracking-widest pl-1">
                                2. Sync Script URL (Write)
                            </label>
                            <input
                                type="text"
                                id="script-url"
                                value={scriptUrl}
                                onChange={(e) => setScriptUrl(e.target.value)}
                                placeholder="https://script.google.com/macros/s/.../exec"
                                className="
                                    w-full px-5 py-4 bg-purple-50/50 border-2 border-transparent focus:border-purple-500 
                                    rounded-2xl transition-all duration-300 outline-none font-bold text-gray-700 placeholder:text-purple-300
                                "
                                disabled={isLoading}
                            />
                            <p className="text-[10px] text-gray-400 pl-1 font-bold">REQUIRED FOR "ADD ENTRY" FEATURE</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
                            w-full py-5 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black text-xl 
                            transition-all transform active:scale-[0.98] disabled:opacity-50
                            shadow-xl hover:shadow-2xl flex items-center justify-center gap-3
                        "
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-6 h-6 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-6 h-6" />
                                Setup Dashboard
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm font-bold text-red-700">{error}</p>
                    </div>
                )}

                <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] space-y-4">
                    <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        Setup Checklist
                    </h3>
                    <ul className="text-xs text-gray-500 font-bold space-y-2">
                        <li className="flex gap-2">
                            <span className="text-primary-500">✓</span>
                            Sheet must be "Public" (Anyone with the link can view)
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary-500">✓</span>
                            Verify Apps Script is deployed as a "Web App"
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
