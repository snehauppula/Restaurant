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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                const colors = getColorClasses(kpi.color);
                const isPositive = kpi.change >= 0;

                return (
                    <div
                        key={kpi.title}
                        className="metric-card group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className={`w-6 h-6 ${colors.icon}`} />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                {kpi.title}
                            </p>
                            <p className={`text-3xl font-bold ${colors.text} tracking-tight`}>
                                {kpi.value}
                            </p>


                        </div>
                    </div>
                );
            })}
        </div>
    );
}
