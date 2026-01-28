// Core data types matching the CSV structure
export interface SalesRecord {
    date: string;
    time: string;
    orderId: string;
    itemName: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

// Dashboard metrics
export interface DashboardMetrics {
    totalRevenue: number;
    totalOrders: number;
    averageBillValue: number;
    revenueChange: number;
    ordersChange: number;
}

// Chart data types
export interface TrendDataPoint {
    date: string;
    revenue: number;
}

export interface ItemSalesData {
    name: string;
    quantity: number;
    revenue: number;
}

export interface CategoryData {
    name: string;
    value: number;
    percentage: number;
}

export interface HourlyData {
    hour: string;
    sales: number;
    isPeak: boolean;
}

// Owner-centric feature types
export interface Insight {
    type: 'success' | 'warning' | 'info';
    message: string;
    icon: string;
}

export interface FilterState {
    dateRange: 'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all';
    category: string;
    timeSlot: 'all' | 'morning' | 'lunch' | 'dinner';
}

export interface PerformanceStatus {
    label: string;
    color: 'green' | 'yellow' | 'red';
    trend: 'up' | 'neutral' | 'down';
}

export interface ExecutiveReportData {
    title: string;
    dateRange: string;
    status: {
        label: string;
        color: 'green' | 'yellow' | 'red';
        description: string;
    };
    revenue: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
        trendLabel: string;
    };
    heroItems: {
        topItem: { name: string; quantity: number };
        bestCategory: { name: string; revenue: number };
    };
    attentionItems: {
        slowItem: { name: string; quantity: number };
        lowCategory: { name: string; revenue: number };
    };
    timeStory: {
        peakWindow: string;
        hourlyBars: { hour: string; sales: number; isPeak: boolean }[];
    };
    actions: {
        title: string;
        icon: string;
        color: string;
    }[];
}

