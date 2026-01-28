'use client';

import React from 'react';
import { Download, FileSpreadsheet, Share2 } from 'lucide-react';
import type { SalesRecord } from '@/lib/types';

interface ExportOptionsProps {
    data: SalesRecord[];
}

export default function ExportOptions({ data }: ExportOptionsProps) {
    const handleExportCSV = () => {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }

        // Convert data to CSV
        const headers = ['Date', 'Time', 'Order_ID', 'Item_Name', 'Category', 'Quantity', 'Unit_Price', 'Total_Amount'];
        const csvContent = [
            headers.join(','),
            ...data.map(record =>
                [
                    record.date,
                    record.time,
                    record.orderId,
                    `"${record.itemName}"`,
                    record.category,
                    record.quantity,
                    record.unitPrice,
                    record.totalAmount
                ].join(',')
            )
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sales_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Restaurant Sales Dashboard',
                text: 'Check out my restaurant sales dashboard',
                url: window.location.href,
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Dashboard link copied to clipboard!');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleExportCSV}
                className="
          px-3 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm
          border-2 border-gray-300 hover:border-primary-500 hover:text-primary-600
          transform hover:scale-105 transition-all duration-200
          shadow-sm hover:shadow-md
          flex items-center gap-2
        "
                title="Export to Excel/CSV"
            >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
            </button>

            <button
                onClick={handlePrint}
                className="
          px-3 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm
          border-2 border-gray-300 hover:border-primary-500 hover:text-primary-600
          transform hover:scale-105 transition-all duration-200
          shadow-sm hover:shadow-md
          flex items-center gap-2
        "
                title="Print Dashboard"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
            </button>

            <button
                onClick={handleShare}
                className="
          px-3 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm
          border-2 border-gray-300 hover:border-primary-500 hover:text-primary-600
          transform hover:scale-105 transition-all duration-200
          shadow-sm hover:shadow-md
          flex items-center gap-2
        "
                title="Share Dashboard"
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
            </button>
        </div>
    );
}
