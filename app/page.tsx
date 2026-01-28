'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Link2, X, TrendingUp } from 'lucide-react';
import SheetConfig from '@/components/SheetConfig';
import DailySalesKPIs from '@/components/DailySalesKPIs';
import SalesTrendChart from '@/components/SalesTrendChart';
import TopBottomItems from '@/components/TopBottomItems';
import CategoryPerformance from '@/components/CategoryPerformance';
import PeakHoursChart from '@/components/PeakHoursChart';
import TodaysInsights from '@/components/TodaysInsights';
import QuickFilters from '@/components/QuickFilters';
import ExecutiveReport from '@/components/ExecutiveReport';
import {
    calculateMetrics,
    generateTrendData,
    getTopBottomItems,
    getCategoryData,
    getHourlyData,
    generateInsights,
    generateExecutiveReportData,
    filterByDateRange,
    filterByCategory,
    filterByTimeSlot,
    getUniqueCategories,
} from '@/lib/dataProcessor';
import { fetchSheetData } from '@/lib/sheetsIntegration';
import type { SalesRecord, ExecutiveReportData } from '@/lib/types';

// Default Google Sheets URL (the one provided by the user)
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ZavNIywb80lOThdIXM7zH9FCUj1N8hPe9v1azr2O0gA';

export default function Home() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_SHEET_URL);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Filter state
    const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all'>('all');
    const [category, setCategory] = useState<string>('all');
    const [timeSlot, setTimeSlot] = useState<'all' | 'morning' | 'lunch' | 'dinner'>('all');
    const [showReport, setShowReport] = useState(false);
    const [reportType, setReportType] = useState<'today' | 'thismonth'>('today');
    const [showReportPicker, setShowReportPicker] = useState(false);

    const loadSheetData = async (url: string) => {
        setIsLoading(true);

        try {
            const records = await fetchSheetData(url);
            setSalesData(records);
            setSheetUrl(url);
            setDataLoaded(true);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching Google Sheets data:', error);
            alert('Error loading data from Google Sheets. Please check the URL and sheet permissions.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        if (sheetUrl) {
            loadSheetData(sheetUrl);
        }
    };

    useEffect(() => {
        loadSheetData(DEFAULT_SHEET_URL);
    }, []);

    const hasData = salesData.length > 0;

    // Apply filters
    const filteredData = hasData
        ? filterByTimeSlot(filterByCategory(filterByDateRange(salesData, dateRange), category), timeSlot)
        : [];

    const hasFilteredData = filteredData.length > 0;

    // Calculate all dashboard data from filtered data
    const metrics = hasFilteredData ? calculateMetrics(filteredData) : null;
    const trendData = hasFilteredData ? generateTrendData(filteredData) : [];
    const { top: topItems, bottom: bottomItems } = hasFilteredData
        ? getTopBottomItems(filteredData)
        : { top: [], bottom: [] };
    const categoryData = hasFilteredData ? getCategoryData(filteredData) : [];
    const hourlyData = hasFilteredData ? getHourlyData(filteredData) : [];
    const insights = hasFilteredData ? generateInsights(filteredData) : [];
    const categories = hasData ? getUniqueCategories(salesData) : [];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gradient">
                                    Restaurant Sales Dashboard
                                </h1>
                                {dataLoaded && lastUpdated && (
                                    <div className="text-sm text-gray-600 mt-0.5 flex items-center gap-2">
                                        <span className="flex items-center gap-1">
                                            <Link2 className="w-3 h-3" />
                                            <span className="text-success-600 font-bold">Connected</span>
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-400 font-medium whitespace-nowrap">
                                            Last Refreshed: {lastUpdated.toLocaleTimeString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasData && (
                            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
                                <button
                                    onClick={() => setShowReportPicker(true)}
                                    className="
                                        flex items-center gap-2 px-4 py-2 
                                        bg-gradient-to-r from-primary-600 to-primary-700 
                                        text-white rounded-xl font-bold shadow-lg shadow-primary-200 
                                        hover:shadow-primary-300 hover:scale-[1.03] active:scale-95 
                                        transition-all duration-200 whitespace-nowrap
                                    "
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    <span>Get Snapshot</span>
                                </button>

                                <span className="text-sm text-gray-500 font-medium hidden lg:inline">
                                    {filteredData.length} records
                                </span>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="
                    px-4 py-2 bg-white text-primary-600 rounded-lg font-medium
                    border-2 border-primary-300 hover:border-primary-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:scale-105 transition-all duration-200
                    shadow-sm hover:shadow-md
                    flex items-center gap-2
                  "
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading data from Google Sheets...</p>
                        </div>
                    </div>
                ) : !dataLoaded ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                Welcome! 👋
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Connect your Google Sheets to get instant insights
                            </p>
                        </div>
                        <SheetConfig
                            onSheetUrlSubmit={loadSheetData}
                            isLoading={isLoading}
                            currentSheetUrl={DEFAULT_SHEET_URL}
                        />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* KPIs */}
                        {metrics && <DailySalesKPIs metrics={metrics} />}

                        {/* Quick Filters - Sticky */}
                        <QuickFilters
                            dateRange={dateRange}
                            category={category}
                            timeSlot={timeSlot}
                            categories={categories}
                            onDateRangeChange={setDateRange}
                            onCategoryChange={setCategory}
                            onTimeSlotChange={setTimeSlot}
                        />

                        {/* Today's Insights */}
                        {insights.length > 0 && <TodaysInsights insights={insights} />}

                        {/* Sales Trend */}
                        {trendData.length > 0 && (
                            <SalesTrendChart data={trendData} />
                        )}

                        {/* Top & Bottom Items */}
                        {topItems.length > 0 && bottomItems.length > 0 && (
                            <TopBottomItems topItems={topItems} bottomItems={bottomItems} />
                        )}

                        {/* Category Performance & Peak Hours */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {categoryData.length > 0 && (
                                <CategoryPerformance data={categoryData} />
                            )}
                            {hourlyData.length > 0 && (
                                <PeakHoursChart data={hourlyData} />
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 pb-8 text-center text-sm text-gray-500 print:hidden">
                <p>
                    Designed and Developed by{' '}
                    <a
                        href="https://wa.me/8500097071?text=Hi%20Flowsite%20AI%2C%20I%27m%20interested%20in%20your%20services"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200 underline decoration-2 decoration-primary-400 hover:decoration-primary-600"
                    >
                        Flowsite ai
                    </a>
                </p>
            </footer>

            {/* Report Type Picker Modal */}
            {showReportPicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300 print:hidden">
                    <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowReportPicker(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Select Report Type</h2>
                            <p className="text-gray-500 font-medium">Which business story should we tell?</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setReportType('today');
                                    setShowReportPicker(false);
                                    setShowReport(true);
                                }}
                                className="w-full group p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl border border-primary-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100 transition-all flex items-center gap-6 text-left"
                            >
                                <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Daily Snapshot</h4>
                                    <p className="text-sm text-gray-600">Today's metrics and actionable tips</p>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setReportType('thismonth');
                                    setShowReportPicker(false);
                                    setShowReport(true);
                                }}
                                className="w-full group p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all flex items-center gap-6 text-left"
                            >
                                <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Monthly Summary</h4>
                                    <p className="text-sm text-gray-600">Full month performance analysis</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Executive Report Overlay */}
            {showReport && (
                <ExecutiveReport
                    data={generateExecutiveReportData(
                        filterByDateRange(salesData, reportType),
                        reportType
                    )}
                    onClose={() => setShowReport(false)}
                />
            )}
        </div>
    );
}
