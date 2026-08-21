'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { parseStoreCsvFiles, ParsedCsvResult } from '../lib/data/csvParser';
import { StoreDataset } from '../lib/types/ecommerce';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (dataset: StoreDataset) => void;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
}) => {
  const [storeName, setStoreName] = useState('');
  const [csvContent, setCsvContent] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedCsvResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
        const nameToUse = storeName || file.name.replace(/\.[^/.]+$/, "");
        if (!storeName) {
          setStoreName(nameToUse);
        }
        const res = parseStoreCsvFiles(nameToUse, text);
        setParsedResult(res);
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmUpload = () => {
    if (parsedResult?.dataset) {
      const finalDataset = {
        ...parsedResult.dataset,
        name: storeName || parsedResult.dataset.name,
      };
      onDatasetLoaded(finalDataset);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Upload Store CSV Data</h3>
              <p className="text-xs text-slate-400">Import orders, products, customers, or abandoned carts CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Store Name</label>
          <input
            type="text"
            placeholder="e.g. Acme Apparel"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Drag & Drop File Input */}
        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/40 relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-200">Click to upload CSV or drag and drop</p>
          <p className="text-[11px] text-slate-500 mt-1">Supports Shopify, Stripe, WooCommerce, or custom store export files</p>
        </div>

        {/* Parsing Summary */}
        {parsedResult && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {parsedResult.error ? (
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parsedResult.error}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> CSV Parsed Successfully!
                </div>
                <div className="text-slate-400 grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <span>Products: {parsedResult.summary?.productsCount}</span>
                  <span>Customers: {parsedResult.summary?.customersCount}</span>
                  <span>Orders: {parsedResult.summary?.ordersCount}</span>
                  <span>Carts: {parsedResult.summary?.abandonedCartsCount}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmUpload}
            disabled={!parsedResult?.dataset}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl disabled:opacity-50"
          >
            Import Store Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
