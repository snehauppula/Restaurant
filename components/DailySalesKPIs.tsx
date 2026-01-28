'use client';

import React from 'react';
import { ShoppingCart, DollarSign, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/dataProcessor';
import type { DashboardMetrics } from '@/lib/types';

interface DailySalesKPIsProps {
    metrics: DashboardMetrics;
}

export default function DailySalesKPIs({ metrics }: DailySalesKPIsProps) {
    const kpis = [
        {
            title: "Today's Sales",
            value: formatCurrency(metrics.totalRevenue),
            change: metrics.revenueChange,
            icon: DollarSign,
            color: 'primary',
        },
        {
            title: 'Total Orders',
            value: metrics.totalOrders.toString(),
            change: metrics.ordersChange,
            icon: ShoppingCart,
            color: 'success',
        },
        {
            title: 'Average Bill',
            value: formatCurrency(metrics.averageBillValue),
            change: 0,
            icon: Receipt,
            color: 'purple',
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; icon: string; text: string }> = {
            primary: {
                bg: 'bg-primary-50',
                icon: 'text-primary-600',
                text: 'text-primary-700',
            },
            success: {
                bg: 'bg-success-50',
                icon: 'text-success-600',
                text: 'text-success-700',
            },
            purple: {
                bg: 'bg-purple-50',
                icon: 'text-purple-600',
                text: 'text-purple-700',
            },
        };
        return colors[color] || colors.primary;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                const colors = getColorClasses(kpi.color);

                return (
                    <div
                        key={kpi.title}
                        className={`metric-card group p-4 sm:p-6 ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                    >
                        <div className="flex items-center sm:items-start justify-between mb-3 sm:mb-4">
                            <div className={`p-2.5 sm:p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest sm:hidden">
                                Live Metric
                            </p>
                        </div>

                        <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-tight">
                                {kpi.title}
                            </p>
                            <p className={`text-2xl sm:text-3xl font-black ${colors.text} tracking-tighter`}>
                                {kpi.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
