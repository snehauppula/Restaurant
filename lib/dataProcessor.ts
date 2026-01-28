import { parse } from 'papaparse';
import { format, parseISO, subDays, isValid } from 'date-fns';
import type {
    SalesRecord,
    DashboardMetrics,
    TrendDataPoint,
    ItemSalesData,
    CategoryData,
    HourlyData,
    ExecutiveReportData,
} from './types';

// Parse CSV file to SalesRecord array
export function parseCSV(file: File): Promise<SalesRecord[]> {
    return new Promise((resolve, reject) => {
        parse(file, {
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
            error: (error) => {
                reject(error);
            },
        });
    });
}

// Calculate dashboard KPIs
export function calculateMetrics(records: SalesRecord[]): DashboardMetrics {
    const totalRevenue = records.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalOrders = new Set(records.map(r => r.orderId)).size;
    const averageBillValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // For comparison, we'll calculate based on the last day vs previous days
    const dates = [...new Set(records.map(r => r.date))].sort();
    const latestDate = dates[dates.length - 1];
    const previousDate = dates[dates.length - 2];

    const latestDayRecords = records.filter(r => r.date === latestDate);
    const previousDayRecords = records.filter(r => r.date === previousDate);

    const latestRevenue = latestDayRecords.reduce((sum, r) => sum + r.totalAmount, 0);
    const previousRevenue = previousDayRecords.reduce((sum, r) => sum + r.totalAmount, 0);

    const latestOrders = new Set(latestDayRecords.map(r => r.orderId)).size;
    const previousOrders = new Set(previousDayRecords.map(r => r.orderId)).size;

    const revenueChange = previousRevenue > 0
        ? ((latestRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const ordersChange = previousOrders > 0
        ? ((latestOrders - previousOrders) / previousOrders) * 100
        : 0;

    return {
        totalRevenue,
        totalOrders,
        averageBillValue,
        revenueChange,
        ordersChange,
    };
}

// Generate trend data for line chart
export function generateTrendData(records: SalesRecord[]): TrendDataPoint[] {
    const dailyRevenue = new Map<string, number>();

    records.forEach(record => {
        const current = dailyRevenue.get(record.date) || 0;
        dailyRevenue.set(record.date, current + record.totalAmount);
    });

    return Array.from(dailyRevenue.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => {
            // Parse DD-MM-YYYY format
            const [dayA, monthA, yearA] = a.date.split('-').map(Number);
            const [dayB, monthB, yearB] = b.date.split('-').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateA.getTime() - dateB.getTime();
        });
}

// Get top and bottom selling items
export function getTopBottomItems(records: SalesRecord[]): {
    top: ItemSalesData[];
    bottom: ItemSalesData[];
} {
    const itemStats = new Map<string, { quantity: number; revenue: number }>();

    records.forEach(record => {
        const current = itemStats.get(record.itemName) || { quantity: 0, revenue: 0 };
        itemStats.set(record.itemName, {
            quantity: current.quantity + record.quantity,
            revenue: current.revenue + record.totalAmount,
        });
    });

    const items: ItemSalesData[] = Array.from(itemStats.entries()).map(
        ([name, stats]) => ({
            name,
            quantity: stats.quantity,
            revenue: stats.revenue,
        })
    );

    const sorted = items.sort((a, b) => b.quantity - a.quantity);

    return {
        top: sorted.slice(0, 5),
        bottom: sorted.slice(-5).reverse(),
    };
}

// Get category performance data
export function getCategoryData(records: SalesRecord[]): CategoryData[] {
    const categoryRevenue = new Map<string, number>();

    records.forEach(record => {
        const current = categoryRevenue.get(record.category) || 0;
        categoryRevenue.set(record.category, current + record.totalAmount);
    });

    const total = Array.from(categoryRevenue.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryRevenue.entries())
        .map(([name, value]) => ({
            name,
            value,
            percentage: total > 0 ? (value / total) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value);
}

// Get hourly sales data
export function getHourlyData(records: SalesRecord[]): HourlyData[] {
    const hourlySales = new Map<number, number>();

    records.forEach(record => {
        const hour = parseInt(record.time.split(':')[0]);
        if (!isNaN(hour)) {
            const current = hourlySales.get(hour) || 0;
            hourlySales.set(hour, current + record.totalAmount);
        }
    });

    // Create array for all 24 hours
    const hourlyData: HourlyData[] = [];
    for (let hour = 0; hour < 24; hour++) {
        const sales = hourlySales.get(hour) || 0;
        // Peak hours: lunch (12-14) and dinner (19-21)
        const isPeak = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);
        hourlyData.push({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            sales,
            isPeak,
        });
    }

    return hourlyData;
}

// Format currency
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
}

// Get performance status compared to 7-day average
export function getPerformanceStatus(current: number, average: number): { label: string, color: 'green' | 'yellow' | 'red', trend: 'up' | 'neutral' | 'down' } {
    const diff = ((current - average) / average) * 100;

    if (diff > 10) {
        return { label: 'Above Average', color: 'green', trend: 'up' };
    } else if (diff < -10) {
        return { label: 'Below Average', color: 'red', trend: 'down' };
    } else {
        return { label: 'Normal', color: 'yellow', trend: 'neutral' };
    }
}

// Generate actionable insights
export function generateInsights(records: SalesRecord[]): Array<{ type: 'success' | 'warning' | 'info', message: string, icon: string }> {
    const insights: Array<{ type: 'success' | 'warning' | 'info', message: string, icon: string }> = [];

    if (records.length === 0) return insights;

    // Get total quantity
    const totalQuantity = records.reduce((sum, r) => sum + r.quantity, 0);

    // Get item stats
    const itemStats = new Map<string, number>();
    records.forEach(r => {
        const current = itemStats.get(r.itemName) || 0;
        itemStats.set(r.itemName, current + r.quantity);
    });

    // Top selling item (>20% of total)
    const sortedItems = Array.from(itemStats.entries()).sort((a, b) => b[1] - a[1]);
    if (sortedItems.length > 0) {
        const topItem = sortedItems[0];
        const percentage = (topItem[1] / totalQuantity) * 100;
        if (percentage > 20) {
            insights.push({
                type: 'success',
                message: `${topItem[0]} is your top seller today — ensure stock availability`,
                icon: '🔥'
            });
        }
    }

    // Slow moving item (<3% of total)
    if (sortedItems.length > 3) {
        const slowItem = sortedItems[sortedItems.length - 1];
        const percentage = (slowItem[1] / totalQuantity) * 100;
        if (percentage < 3 && slowItem[1] > 0) {
            insights.push({
                type: 'warning',
                message: `${slowItem[0]} sales are low — consider promoting or bundling it`,
                icon: '💡'
            });
        }
    }

    // Peak hours insight
    const hourlySales = new Map<number, number>();
    records.forEach(r => {
        const hour = parseInt(r.time.split(':')[0]);
        if (!isNaN(hour)) {
            const current = hourlySales.get(hour) || 0;
            hourlySales.set(hour, current + r.totalAmount);
        }
    });

    const peakHours = Array.from(hourlySales.entries())
        .filter(([_, sales]) => sales > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([hour]) => hour);

    if (peakHours.length > 0) {
        const peakText = peakHours.map(h => {
            if (h >= 12 && h <= 14) return 'lunch (12-2 PM)';
            if (h >= 19 && h <= 21) return 'dinner (7-9 PM)';
            return `${h}:00 hour`;
        }).join(' and ');

        insights.push({
            type: 'info',
            message: `Peak sales during ${peakText} — plan staffing accordingly`,
            icon: '👥'
        });
    }

    return insights.slice(0, 3); // Return max 3 insights
}

// Filter data by date range
export function filterByDateRange(records: SalesRecord[], range: 'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all'): SalesRecord[] {
    if (range === 'all') return records;

    const dates = [...new Set(records.map(r => r.date))].sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
    });

    if (dates.length === 0) return [];

    const latestDate = dates[dates.length - 1];

    switch (range) {
        case 'today':
            return records.filter(r => r.date === latestDate);
        case 'yesterday':
            const yesterdayDate = dates.length > 1 ? dates[dates.length - 2] : latestDate;
            return records.filter(r => r.date === yesterdayDate);
        case 'last7days':
            const last7Dates = dates.slice(-7);
            return records.filter(r => last7Dates.includes(r.date));
        case 'thismonth':
            const [_, latestMonth, latestYear] = latestDate.split('-').map(Number);
            return records.filter(r => {
                const [__, month, year] = r.date.split('-').map(Number);
                return month === latestMonth && year === latestYear;
            });
        default:
            return records;
    }
}

// Filter by category
export function filterByCategory(records: SalesRecord[], category: string): SalesRecord[] {
    if (category === 'all' || !category) return records;
    return records.filter(r => r.category === category);
}

// Filter by time slot
export function filterByTimeSlot(records: SalesRecord[], slot: 'all' | 'morning' | 'lunch' | 'dinner'): SalesRecord[] {
    if (slot === 'all') return records;

    return records.filter(r => {
        const hour = parseInt(r.time.split(':')[0]);
        if (isNaN(hour)) return false;

        switch (slot) {
            case 'morning':
                return hour >= 6 && hour < 12;
            case 'lunch':
                return hour >= 12 && hour < 16;
            case 'dinner':
                return hour >= 19 && hour < 23;
            default:
                return true;
        }
    });
}

// Get all unique categories
export function getUniqueCategories(records: SalesRecord[]): string[] {
    return [...new Set(records.map(r => r.category))].sort();
}

// Generate Executive Report Data
export function generateExecutiveReportData(records: SalesRecord[], range: 'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all'): ExecutiveReportData {
    const metrics = calculateMetrics(records);
    const hourlyData = getHourlyData(records);
    const categoryData = getCategoryData(records);
    const { top: topItems } = getTopBottomItems(records);

    // 1. Title and Date Range
    let title = "Daily Snapshot";
    let dateRange = records[0]?.date || "N/A";

    if (range === 'thismonth' || records.length > 50) {
        title = "Monthly Performance Summary";
        const dates = [...new Set(records.map(r => r.date))];
        if (dates.length > 0) {
            // Get Month-Year from first date
            const [d, m, y] = dates[0].split('-');
            const monthName = new Date(parseInt(y), parseInt(m) - 1).toLocaleString('default', { month: 'long' });
            dateRange = `${monthName} ${y}`;
        }
    } else if (range === 'last7days') {
        title = "Weekly Business Summary";
        dateRange = "Last 7 Days";
    }

    // 2. Status Determination (Is this good or bad?)
    // Simple heuristic: compare total income to a target or average
    // For now, using the same logic as PerformanceStatus
    let statusLabel = "Average Day";
    let statusColor: 'green' | 'yellow' | 'red' = 'yellow';
    let statusDesc = "Steady performance. Business is behaving normally.";

    if (metrics.revenueChange > 10) {
        statusLabel = "Strong Day";
        statusColor = 'green';
        statusDesc = "Excellent! You have outperformed your recent average.";
    } else if (metrics.revenueChange < -15) {
        statusLabel = "Slow Day";
        statusColor = 'red';
        statusDesc = "Business was quieter than usual today.";
    }

    // 3. Hero items
    const heroDish = topItems[0] ? { name: topItems[0].name, quantity: topItems[0].quantity } : { name: "N/A", quantity: 0 };
    const bestCategory = categoryData[0] ? { name: categoryData[0].name, revenue: categoryData[0].value } : { name: "N/A", revenue: 0 };

    // 4. Attention items
    const { bottom: bottomItems } = getTopBottomItems(records);
    const slowDish = bottomItems[0] ? { name: bottomItems[0].name, quantity: bottomItems[0].quantity } : { name: "N/A", quantity: 0 };
    const lowCategory = categoryData[categoryData.length - 1] ? { name: categoryData[categoryData.length - 1].name, revenue: categoryData[categoryData.length - 1].value } : { name: "N/A", revenue: 0 };

    // 5. Time Story
    const peakBars = hourlyData.filter(d => d.isPeak);
    const peakWindow = peakBars.length > 0 ? `${peakBars[0].hour} - ${peakBars[peakBars.length - 1].hour}` : "N/A";

    // 6. Action cards
    const actions = [];
    if (heroDish.quantity > 10) actions.push({ title: `Stock up on ${heroDish.name}`, icon: "📦", color: "green" });
    if (slowDish.quantity < 3) actions.push({ title: `Run offer on ${slowDish.name}`, icon: "🏷️", color: "amber" });
    if (peakBars.some(b => b.sales > metrics.averageBillValue * 5)) actions.push({ title: "Extra staff for lunch", icon: "👥", color: "blue" });
    if (actions.length === 0) actions.push({ title: "All good! Maintain current operations", icon: "✨", color: "purple" });

    return {
        title,
        dateRange,
        status: {
            label: statusLabel,
            color: statusColor,
            description: statusDesc,
        },
        revenue: {
            value: formatCurrency(metrics.totalRevenue),
            trend: metrics.revenueChange > 5 ? 'up' : metrics.revenueChange < -5 ? 'down' : 'neutral',
            trendLabel: metrics.revenueChange > 5 ? 'Better than usual' : metrics.revenueChange < -5 ? 'Below average' : 'Consistent',
        },
        heroItems: {
            topItem: heroDish,
            bestCategory: bestCategory,
        },
        attentionItems: {
            slowItem: slowDish,
            lowCategory: lowCategory,
        },
        timeStory: {
            peakWindow,
            hourlyBars: hourlyData.map(h => ({ hour: h.hour, sales: h.sales, isPeak: h.isPeak })),
        },
        actions: actions.slice(0, 3)
    };
}
