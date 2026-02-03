'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Link2, X, TrendingUp, Plus } from 'lucide-react';
import DailySalesKPIs from '@/components/DailySalesKPIs';
import SalesTrendChart from '@/components/SalesTrendChart';
import TopBottomItems from '@/components/TopBottomItems';
import CategoryPerformance from '@/components/CategoryPerformance';
import PeakHoursChart from '@/components/PeakHoursChart';
import TodaysInsights from '@/components/TodaysInsights';
import QuickFilters from '@/components/QuickFilters';
import ExecutiveReport from '@/components/ExecutiveReport';
import AddEntryModal from '@/components/AddEntryModal';
import DashboardSkeleton from '@/components/DashboardSkeleton';
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
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLpP6YAadH8GFlY9W0cyx7tbgTZ7GQuDVl-6LPtCnQC1PglLOWaX0-hJ_3_3Ps2nh_/exec';

export default function Home() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_SHEET_URL);
    const [scriptUrl, setScriptUrl] = useState<string>(DEFAULT_SCRIPT_URL); // For Add Entry sync
    const [dataLoaded, setDataLoaded] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Filter state
    const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all'>('all');
    const [category, setCategory] = useState<string>('all');
    const [timeSlot, setTimeSlot] = useState<'all' | 'morning' | 'lunch' | 'dinner'>('all');
    const [showReport, setShowReport] = useState(false);
    const [reportType, setReportType] = useState<'today' | 'thismonth'>('today');
    const [showReportPicker, setShowReportPicker] = useState(false);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Caching keys

    const CACHE_KEY = 'restaurant_sales_data';
    const CACHE_TIME_KEY = 'restaurant_sales_last_updated';

    const loadSheetData = async (url: string, showFullLoader = false) => {
        if (showFullLoader) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            setError(null);
            const records = await fetchSheetData(url);
            setSalesData(records);
            setSheetUrl(url);
            setDataLoaded(true);
            const now = new Date();
            setLastUpdated(now);

            // Cache data
            localStorage.setItem(CACHE_KEY, JSON.stringify(records));
            localStorage.setItem(CACHE_TIME_KEY, now.toISOString());
        } catch (error) {
            console.error('Error fetching Google Sheets data:', error);
            setError('Failed to load data. Please check your Google Sheets URL and ensure it is "Public" (Anyone with the link can view).');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        if (sheetUrl) {
            loadSheetData(sheetUrl, true);
        }
    };

    useEffect(() => {
        // 1. Try to load from cache first for instant UI
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedData) {
            try {
                const records = JSON.parse(cachedData);
                setSalesData(records);
                setDataLoaded(true);
                if (cachedTime) {
                    setLastUpdated(new Date(cachedTime));
                }
                // 2. Background fetch to update cache
                loadSheetData(DEFAULT_SHEET_URL, false);
            } catch (e) {
                console.error('Failed to parse cached data', e);
                loadSheetData(DEFAULT_SHEET_URL, true);
            }
        } else {
            // No cache, do initial full load
            loadSheetData(DEFAULT_SHEET_URL, true);
        }
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

    // Calculate next order ID
    const getNextOrderId = () => {
        if (!hasData) return 'ORD-1001';

        const orderIds = salesData
            .map(r => {
                // Try to extract numeric part from strings like "ORD-123" or "123"
                const match = r.orderId.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            })
            .filter(id => id > 0);

        if (orderIds.length === 0) return 'ORD-1001';

        const maxId = Math.max(...orderIds);
        return `ORD-${maxId + 1}`;
    };

    const nextOrderId = getNextOrderId();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex-shrink-0">
                                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-2xl font-bold text-gradient truncate">
                                    Vistara Restaurant <span className="hidden xs:inline">Dashboard</span>
                                </h1>
                                <div className="text-[10px] sm:text-sm text-gray-600 mt-0.5 flex items-center gap-1 sm:gap-2">
                                    {isRefreshing ? (
                                        <span className="flex items-center gap-1.5 animate-pulse">
                                            <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-500 animate-spin" />
                                            <span className="text-primary-600 font-bold">Refreshing...</span>
                                        </span>
                                    ) : (
                                        <>
                                            {dataLoaded && (
                                                <span className="flex items-center gap-0.5 sm:gap-1">
                                                    <Link2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success-600" />
                                                    <span className="text-success-600 font-bold">Live Data</span>
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {lastUpdated && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-gray-400 font-medium truncate">
                                                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {dataLoaded && (
                            <div className="flex items-center gap-1.5 sm:gap-3">
                                <button
                                    onClick={() => setShowReportPicker(true)}
                                    title="Get Snapshot"
                                    className="
                                        flex items-center justify-center gap-2 p-2.5 sm:px-4 sm:py-2 
                                        bg-gradient-to-r from-primary-600 to-primary-700 
                                        text-white rounded-xl font-bold shadow-lg shadow-primary-200 
                                        hover:shadow-primary-300 hover:scale-[1.03] active:scale-95 
                                        transition-all duration-200
                                    "
                                >
                                    <BarChart3 className="w-5 h-5 sm:w-4 sm:h-4" />
                                    <span className="hidden md:inline">Snapshot</span>
                                </button>

                                <button
                                    onClick={() => setShowAddEntry(true)}
                                    title="Add Entry"
                                    className="
                                        flex items-center justify-center gap-2 p-2.5 sm:px-4 sm:py-2 
                                        bg-gray-900 text-white rounded-xl font-bold
                                        hover:bg-black hover:scale-[1.03] active:scale-95 
                                        transition-all duration-200 shadow-lg shadow-gray-200
                                    "
                                >
                                    <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                                    <span className="hidden md:inline">Add Entry</span>
                                </button>

                                <button
                                    onClick={handleRefresh}
                                    disabled={isLoading || isRefreshing}
                                    title="Refresh"
                                    className="
                                        p-2.5 sm:px-4 sm:py-2 bg-white text-primary-600 rounded-xl font-medium
                                        border-2 border-primary-200 hover:border-primary-400
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transform hover:scale-105 transition-all duration-200
                                        shadow-sm hover:shadow-md flex items-center justify-center
                                    "
                                >
                                    <RefreshCw className={`w-5 h-5 sm:w-4 sm:h-4 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 print:hidden">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                            <X className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-red-800 font-bold">Connection Issue</h3>
                            <p className="text-red-700 text-sm mt-0.5">{error}</p>
                        </div>
                    </div>
                )}

                {(isLoading && !dataLoaded) ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="space-y-8">
                        {!dataLoaded && !isLoading && !error && (
                            <DashboardSkeleton />
                        )}

                        {dataLoaded && (
                            <>
                                {/* KPIs */}
                                {metrics && <DailySalesKPIs metrics={metrics} />}

                                {/* Quick Filters */}
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

                                {/* Sales Charts */}
                                {trendData.length > 0 && <SalesTrendChart data={trendData} />}
                                {topItems.length > 0 && bottomItems.length > 0 && (
                                    <TopBottomItems topItems={topItems} bottomItems={bottomItems} />
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {categoryData.length > 0 && <CategoryPerformance data={categoryData} />}
                                    {hourlyData.length > 0 && <PeakHoursChart data={hourlyData} />}
                                </div>
                            </>
                        )}

                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 pb-8 text-center text-sm text-gray-500 print:hidden">
                <p>
                    Designed and Developed by{' '}
                    <a
                        href="https://wa.me/8500097071?text=Hi%20FlowSite%20AI%2C%20I%27m%20interested%20in%20your%20Dashboard%20services"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200 underline decoration-2 decoration-primary-400 hover:decoration-primary-600"
                    >
                        FlowSite AI
                    </a>
                </p>
            </footer>

            {/* Modals */}
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

            {showReport && (
                <ExecutiveReport
                    data={generateExecutiveReportData(
                        filterByDateRange(salesData, reportType),
                        reportType
                    )}
                    onClose={() => setShowReport(false)}
                />
            )}

            <AddEntryModal
                isOpen={showAddEntry}
                onClose={() => setShowAddEntry(false)}
                onSubmitSuccess={handleRefresh}
                scriptUrl={scriptUrl}
                categories={categories}
                nextOrderId={nextOrderId}
            />
        </div>
    );
}
