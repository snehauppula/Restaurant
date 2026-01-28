'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Clock, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    scriptUrl: string;
    categories: string[];
}

export default function AddEntryModal({ isOpen, onClose, onSubmitSuccess, scriptUrl, categories }: AddEntryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        Date: new Date().toLocaleDateString('en-GB').split('/').join('-'), // DD-MM-YYYY
        Time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        Order_ID: `ORD-${Date.now().toString().slice(-6)}`,
        Item_Name: '',
        Category: categories[0] || 'Main Dish',
        Quantity: 1,
        Unit_Price: 0,
        Total_Amount: 0
    });

    // Auto-calculate total amount
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            Total_Amount: prev.Quantity * prev.Unit_Price
        }));
    }, [formData.Quantity, formData.Unit_Price]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.Item_Name.trim()) {
            setError('Please enter an item name');
            setIsLoading(false);
            return;
        }

        if (!scriptUrl) {
            setError('Please configure your Google Apps Script URL first');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/add-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scriptUrl,
                    data: formData
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    onSubmitSuccess();
                    onClose();
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to sync with Google Sheets');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300 hidden sm:block"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full h-full sm:h-auto sm:max-w-xl bg-white sm:rounded-[2.5rem] shadow-2xl overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6 sm:p-8 text-white relative sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-white/20 rounded-2xl backdrop-blur-md flex-shrink-0">
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">Add New Entry</h2>
                            <p className="text-white/70 text-xs sm:text-sm font-medium truncate">Sync live to your Google Sheet</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4 sm:space-y-6 pb-12 sm:pb-8">
                    {success ? (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Success!</h3>
                            <p className="text-gray-500 font-medium">Entry added to your Google Sheet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Date</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.Date}
                                            onChange={e => setFormData({ ...formData, Date: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold text-sm sm:text-base"
                                            placeholder="DD-MM-YYYY"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Time</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.Time}
                                            onChange={e => setFormData({ ...formData, Time: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold text-sm sm:text-base"
                                            placeholder="HH:MM"
                                        />
                                        <Clock className="absolute right-3 sm:right-4 top-3 sm:top-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Item Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData.Item_Name}
                                        onChange={e => setFormData({ ...formData, Item_Name: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold text-sm sm:text-base"
                                        placeholder="e.g. Veg Thali Special"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                                        <select
                                            value={formData.Category}
                                            onChange={e => setFormData({ ...formData, Category: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold appearance-none cursor-pointer text-sm sm:text-base"
                                        >
                                            {categories.length > 0 ? categories.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            )) : (
                                                <option value="Main Dish">Main Dish</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Order ID</label>
                                        <input
                                            type="text"
                                            value={formData.Order_ID}
                                            onChange={e => setFormData({ ...formData, Order_ID: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    <div className="space-y-1.5 sm:space-y-2 col-span-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Qty</label>
                                        <input
                                            type="number"
                                            value={formData.Quantity}
                                            onChange={e => setFormData({ ...formData, Quantity: Math.max(1, parseInt(e.target.value) || 0) })}
                                            className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2 col-span-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Price</label>
                                        <input
                                            type="number"
                                            value={formData.Unit_Price}
                                            onChange={e => setFormData({ ...formData, Unit_Price: Math.max(0, parseFloat(e.target.value) || 0) })}
                                            className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-xl sm:rounded-2xl transition-all outline-none font-bold text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2 col-span-1">
                                        <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest pl-1">Total</label>
                                        <div className="w-full px-2 sm:px-4 py-2.5 sm:py-3 bg-primary-50 border-2 border-primary-100 rounded-xl sm:rounded-2xl font-black text-primary-700 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                                            <Calculator className="hidden xs:block w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
                                            {formData.Total_Amount}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 sm:pt-4 space-y-4 sm:space-y-4">
                                {error && (
                                    <div className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl sm:rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs sm:text-sm font-bold text-red-700">{error}</p>
                                    </div>
                                )}

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl sm:rounded-3xl font-black text-lg transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Add to Sheet
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    Entry will be saved instantly
                                </p>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
