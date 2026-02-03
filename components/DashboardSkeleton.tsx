'use client';

import React from 'react';

export default function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* KPI Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-32 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                            <div className="w-20 h-3 bg-gray-100 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-24 h-3 bg-gray-100 rounded-full"></div>
                            <div className="w-32 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Filters Skeleton */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-24 bg-gray-100 rounded-xl"></div>
                ))}
            </div>

            {/* Insights Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-primary-50/50 rounded-2xl border border-primary-100/50"></div>
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80">
                <div className="w-48 h-6 bg-gray-100 rounded-full mb-8"></div>
                <div className="flex items-end justify-between h-48 gap-2">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 rounded-t-lg w-full"
                            style={{ height: `${Math.random() * 80 + 20}%` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Grid Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80">
                    <div className="w-40 h-6 bg-gray-100 rounded-full mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="w-full h-3 bg-gray-100 rounded-full"></div>
                                    <div className="w-2/3 h-3 bg-gray-100 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-80">
                    <div className="w-40 h-6 bg-gray-100 rounded-full mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-full h-10 bg-gray-100 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
