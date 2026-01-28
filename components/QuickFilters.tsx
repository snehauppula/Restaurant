'use client';

import React from 'react';
import { Calendar, Filter, Clock } from 'lucide-react';

interface QuickFiltersProps {
    dateRange: 'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all';
    category: string;
    timeSlot: 'all' | 'morning' | 'lunch' | 'dinner';
    categories: string[];
    onDateRangeChange: (range: 'today' | 'yesterday' | 'last7days' | 'thismonth' | 'all') => void;
    onCategoryChange: (category: string) => void;
    onTimeSlotChange: (slot: 'all' | 'morning' | 'lunch' | 'dinner') => void;
}

export default function QuickFilters({
    dateRange,
    category,
    timeSlot,
    categories,
    onDateRangeChange,
    onCategoryChange,
    onTimeSlotChange,
}: QuickFiltersProps) {
    const dateRanges = [
        { value: 'today' as const, label: 'Today' },
        { value: 'yesterday' as const, label: 'Yesterday' },
        { value: 'last7days' as const, label: 'Last 7 Days' },
        { value: 'thismonth' as const, label: 'This Month' },
        { value: 'all' as const, label: 'All Time' },
    ];

    const timeSlots = [
        { value: 'all' as const, label: 'All Day' },
        { value: 'morning' as const, label: 'Morning (6-12)' },
        { value: 'lunch' as const, label: 'Lunch (12-4)' },
        { value: 'dinner' as const, label: 'Dinner (7-11)' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Date Range Filter */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Date Range</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {dateRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => onDateRangeChange(range.value)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200
                                    ${dateRange === range.value
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-100'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-200 border border-gray-100'
                                    }
                                `}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Category</label>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="
                            w-full px-3 py-2 rounded-xl border-2 border-gray-100
                            text-sm font-bold text-gray-700
                            hover:border-primary-200 focus:border-primary-500 focus:outline-none
                            transition-all duration-200 bg-gray-50/50
                        "
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Slot Filter */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider">Time Period</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.value}
                                onClick={() => onTimeSlotChange(slot.value)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200
                                    ${timeSlot === slot.value
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-100'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-200 border border-gray-100'
                                    }
                                `}
                            >
                                {slot.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
