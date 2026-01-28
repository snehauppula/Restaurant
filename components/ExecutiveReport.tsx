'use client';

import React from 'react';
import { X, Printer, TrendingUp, TrendingDown, Minus, Award, AlertCircle, Clock, CheckCircle2, Share2 } from 'lucide-react';
import type { ExecutiveReportData } from '@/lib/types';

interface ExecutiveReportProps {
    data: ExecutiveReportData;
    onClose: () => void;
}

export default function ExecutiveReport({ data, onClose }: ExecutiveReportProps) {
    const handlePrint = () => {
        window.print();
    };

    const getStatusIcon = (color: string) => {
        switch (color) {
            case 'green': return <CheckCircle2 className="w-8 h-8 text-green-600" />;
            case 'red': return <AlertCircle className="w-8 h-8 text-red-600" />;
            default: return <Minus className="w-8 h-8 text-yellow-600" />;
        }
    };

    const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up': return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'down': return <TrendingDown className="w-5 h-5 text-red-600" />;
            default: return <Minus className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300 print:relative print:z-auto print:bg-white print:p-0 print:block" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
            <div className="bg-white w-full max-w-4xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto sm:rounded-3xl shadow-2xl relative print:shadow-none print:max-h-full print:rounded-none print:static print:overflow-visible">

                {/* Close & Print Buttons (Hidden in Print) */}
                <div className="sticky top-0 z-10 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between print:hidden">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all active:scale-95 shadow-lg shadow-primary-200"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Report</span>
                        </button>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-12 print:p-6 print:space-y-8">

                    {/* Header / Cover */}
                    <div className="text-center space-y-4 print:space-y-3">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Business Intelligence Report
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                            {data.title}
                        </h1>
                        <p className="text-xl text-gray-500 font-medium">
                            {data.dateRange}
                        </p>

                        <div className={`mt-8 inline-flex flex-col items-center p-6 rounded-3xl border-2 print:mt-4 ${data.status.color === 'green' ? 'bg-green-50 border-green-100' :
                            data.status.color === 'red' ? 'bg-red-50 border-red-100' :
                                'bg-yellow-50 border-yellow-100'
                            }`}>
                            {getStatusIcon(data.status.color)}
                            <div className={`mt-3 text-2xl font-bold ${data.status.color === 'green' ? 'text-green-800' :
                                data.status.color === 'red' ? 'text-red-800' :
                                    'text-yellow-800'
                                }`}>
                                {data.status.label}
                            </div>
                            <p className="text-gray-600 mt-1 max-w-sm text-sm">
                                {data.status.description}
                            </p>
                        </div>
                    </div>

                    {/* Money Snapshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 print:gap-4 print:pt-4 break-inside-avoid">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gross Revenue</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl sm:text-6xl font-black text-primary-700 tracking-tighter">
                                    {data.revenue.value}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                    {getTrendIcon(data.revenue.trend)}
                                    <span className="text-sm font-bold text-gray-700">{data.revenue.trendLabel}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100">
                                <p className="text-primary-700 font-medium italic text-right">
                                    "Your revenue is driven by a strong lunch window today."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hero & Attention Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print:gap-8 break-inside-avoid">
                        {/* HERO SECTION */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Award className="w-4 h-4 text-primary-500" />
                                Revenue Drivers
                            </h3>
                            <div className="space-y-4">
                                <div className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 hover:shadow-xl hover:shadow-green-100/50 transition-all cursor-default">
                                    <p className="text-green-600 font-bold text-xs uppercase mb-1">Hero Dish</p>
                                    <h4 className="text-2xl font-bold text-green-900">{data.heroItems.topItem.name}</h4>
                                    <p className="text-green-700 text-sm mt-1">{data.heroItems.topItem.quantity} plates served today</p>
                                </div>
                                <div className="group p-6 bg-white rounded-3xl border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-100/20 transition-all cursor-default">
                                    <p className="text-primary-600 font-bold text-xs uppercase mb-1">Top Category</p>
                                    <h4 className="text-2xl font-bold text-gray-900">{data.heroItems.bestCategory.name}</h4>
                                    <p className="text-gray-500 text-sm mt-1">Driving most of your traffic</p>
                                </div>
                            </div>
                        </div>

                        {/* ATTENTION SECTION */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Growth Opportunities
                            </h3>
                            <div className="space-y-4">
                                <div className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-100 transition-all cursor-default">
                                    <p className="text-amber-600 font-bold text-xs uppercase mb-1">Slow Mover</p>
                                    <h4 className="text-2xl font-bold text-amber-900">{data.attentionItems.slowItem.name}</h4>
                                    <p className="text-amber-700 text-sm mt-1">Consider bundling or promotion</p>
                                </div>
                                <div className="group p-6 bg-white rounded-3xl border border-gray-100 transition-all cursor-default">
                                    <p className="text-amber-600 font-bold text-xs uppercase mb-1">Low Demand</p>
                                    <h4 className="text-2xl font-bold text-gray-900">{data.attentionItems.lowCategory.name}</h4>
                                    <p className="text-gray-500 text-sm mt-1">Opportunities to optimize menu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Story */}
                    <div className="space-y-6 pt-6 border-t border-gray-100 print:space-y-4 print:pt-4 break-inside-avoid">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-500" />
                                Traffic Story
                            </h3>
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                                {data.timeStory.peakWindow.includes(' - ') && data.timeStory.peakWindow.split(' - ')[0] === data.timeStory.peakWindow.split(' - ')[1]
                                    ? `Peak: ${data.timeStory.peakWindow.split(' - ')[0]}`
                                    : `Peak: ${data.timeStory.peakWindow}`
                                }
                            </span>
                        </div>

                        <div className="h-16 flex items-end gap-[1px] sm:gap-0.5 print:h-12">
                            {data.timeStory.hourlyBars.map((bar, i) => (
                                <div
                                    key={i}
                                    title={`${bar.hour}: ${bar.sales}`}
                                    className={`flex-1 rounded-t-[1px] sm:rounded-t-sm transition-all duration-700 ${bar.isPeak
                                        ? 'bg-primary-600 h-full'
                                        : bar.sales > 0 ? 'bg-primary-200 h-1/2' : 'bg-gray-100 h-1/6'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-[0.1em] pt-2">
                            <span>12 AM</span>
                            <span>Morning</span>
                            <span>Lunch</span>
                            <span>Dinner</span>
                            <span>11 PM</span>
                        </div>
                    </div>

                    {/* Actions - MOST IMPORTANT */}
                    <div className="p-8 sm:p-10 bg-gray-900 rounded-[2rem] text-white space-y-8 print:p-6 print:rounded-3xl print:space-y-4 break-inside-avoid">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">What to do next?</h2>
                            <p className="text-gray-400">Personalized recommendations for your operations</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:gap-2">
                            {data.actions.map((action, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-all break-inside-avoid">
                                    <span className="text-4xl mb-4 print:text-2xl print:mb-2" role="img" aria-label="icon">{action.icon}</span>
                                    <p className="font-bold text-lg leading-tight print:text-sm">{action.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-gray-100 text-center space-y-3 pb-12">
                        <p className="text-xs font-bold text-gray-500">
                            Developed by{' '}
                            <a
                                href="https://wa.me/8500097071?text=Hi%20Flowsite%20AI%2C%20I%27m%20viewing%20the%20business%20snapshot%20and%20need%20assistance"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 underline decoration-primary-300"
                            >
                                Flowsite ai
                            </a>
                        </p>
                        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-2">
                            <Share2 className="w-3 h-3 text-gray-300" />
                            Generated automatically from your live sales data
                        </p>
                        <p className="text-[10px] text-gray-300 font-mono tracking-widest uppercase">
                            Report ID: SNAP-{Date.now().toString().slice(-6)} • {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
