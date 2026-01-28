'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/dataProcessor';
import type { HourlyData } from '@/lib/types';

interface PeakHoursChartProps {
    data: HourlyData[];
}

export default function PeakHoursChart({ data }: PeakHoursChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-premium-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {payload[0].payload.hour}
                    </p>
                    <p className="text-sm text-gray-600">
                        Sales: <span className="font-bold text-gray-900">{formatCurrency(payload[0].value)}</span>
                    </p>
                    {payload[0].payload.isPeak && (
                        <p className="text-xs text-amber-600 font-medium mt-1">
                            🔥 Peak Hour
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-card">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Busy Hours
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Sales throughout the day
                    <span className="ml-2 text-amber-600 font-medium">🔥 = Peak hours</span>
                </p>


            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="hour"
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
                        <Bar
                            dataKey="sales"
                            radius={[8, 8, 0, 0]}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isPeak ? 'url(#peakGradient)' : 'url(#normalGradient)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
