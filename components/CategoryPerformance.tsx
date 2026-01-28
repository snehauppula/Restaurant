'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/dataProcessor';
import type { CategoryData } from '@/lib/types';

interface CategoryPerformanceProps {
    data: CategoryData[];
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

export default function CategoryPerformance({ data }: CategoryPerformanceProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-premium-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        Revenue: <span className="font-bold text-gray-900">{formatCurrency(payload[0].value)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Share: <span className="font-bold text-gray-900">{payload[0].payload.percentage.toFixed(1)}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
            {payload.map((entry: any, index: number) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="chart-card">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-primary-600" />
                    Category Performance
                </h3>
                <p className="text-sm text-gray-500 mt-1">Revenue share by category</p>
            </div>

            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={4}
                            dataKey="value"
                            animationDuration={1000}
                            label={({ percentage }) => `${percentage.toFixed(0)}%`}
                            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="hover:opacity-80 transition-opacity duration-200"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
