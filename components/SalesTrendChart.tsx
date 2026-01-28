'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/dataProcessor';
import type { TrendDataPoint } from '@/lib/types';

interface SalesTrendChartProps {
    data: TrendDataPoint[];
}

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-premium-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {payload[0].payload.date}
                    </p>
                    <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        Sales Trend
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Daily revenue over time</p>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fill="url(#colorRevenue)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
