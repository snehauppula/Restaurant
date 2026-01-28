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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Date Range Filter */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">Date Range</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {dateRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => onDateRangeChange(range.value)}
                                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${dateRange === range.value
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                `}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter className="w-4 h-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">Category</label>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="
              w-full px-3 py-2 rounded-lg border-2 border-gray-200
              text-sm font-medium text-gray-700
              hover:border-primary-300 focus:border-primary-500 focus:outline-none
              transition-all duration-200 bg-white
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
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">Time Period</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.value}
                                onClick={() => onTimeSlotChange(slot.value)}
                                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${timeSlot === slot.value
                                        ? 'bg-purple-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
