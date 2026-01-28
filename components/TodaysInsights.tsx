'use client';

import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface Insight {
    type: 'success' | 'warning' | 'info';
    message: string;
    icon: string;
}

interface TodaysInsightsProps {
    insights: Insight[];
}

export default function TodaysInsights({ insights }: TodaysInsightsProps) {
    if (insights.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <TrendingUp className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            default:
                return <Lightbulb className="w-5 h-5" />;
        }
    };

    const getColorClasses = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-success-50',
                    border: 'border-success-200',
                    text: 'text-success-900',
                    icon: 'text-success-600',
                };
            case 'warning':
                return {
                    bg: 'bg-warning-50',
                    border: 'border-warning-200',
                    text: 'text-warning-900',
                    icon: 'text-warning-600',
                };
            default:
                return {
                    bg: 'bg-primary-50',
                    border: 'border-primary-200',
                    text: 'text-primary-900',
                    icon: 'text-primary-600',
                };
        }
    };

    return (
        <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                    Today's Insights
                </h3>
            </div>

            <div className="space-y-3">
                {insights.map((insight, index) => {
                    const colors = getColorClasses(insight.type);
                    return (
                        <div
                            key={index}
                            className={`
                p-4 rounded-xl border-2 ${colors.bg} ${colors.border}
                transition-all duration-200 hover:shadow-md
              `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${colors.icon}`}>
                                    <span className="text-xl" role="img" aria-label="insight icon">
                                        {insight.icon}
                                    </span>
                                </div>
                                <p className={`text-sm font-medium ${colors.text} flex-1`}>
                                    {insight.message}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
