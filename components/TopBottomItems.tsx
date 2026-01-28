'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ItemSalesData } from '@/lib/types';

interface TopBottomItemsProps {
    topItems: ItemSalesData[];
    bottomItems: ItemSalesData[];
}

export default function TopBottomItems({ topItems, bottomItems }: TopBottomItemsProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-premium-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        Quantity: <span className="font-bold text-gray-900">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const ChartSection = ({
        title,
        data,
        color,
        icon: Icon
    }: {
        title: string;
        data: ItemSalesData[];
        color: string;
        icon: any;
    }) => (
        <div className="chart-card">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${color === 'success' ? 'text-success-600' : 'text-amber-600'}`} />
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">By quantity sold</p>


            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                        <XAxis
                            type="number"
                            stroke="#9ca3af"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            stroke="#9ca3af"
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="quantity"
                            radius={[0, 8, 8, 0]}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={color === 'success' ? '#22c55e' : '#f59e0b'}
                                    opacity={0.8 + (index * 0.04)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection
                title="Best Selling Dishes"
                data={topItems}
                color="success"
                icon={TrendingUp}
            />
            <ChartSection
                title="Slow Moving Items"
                data={bottomItems}
                color="warning"
                icon={TrendingDown}
            />
        </div>
    );
}
