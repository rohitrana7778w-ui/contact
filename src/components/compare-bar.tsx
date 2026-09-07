"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, X, ArrowRight } from "lucide-react";

export interface CompareProviderItem {
  id: string;
  name: string;
  trustScore: number;
  avatarUrl?: string | null;
}

export function CompareBar() {
  const [items, setItems] = useState<CompareProviderItem[]>([]);

  const loadItems = () => {
    try {
      const stored = localStorage.getItem("compare_providers");
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener("compare_updated", loadItems);
    return () => window.removeEventListener("compare_updated", loadItems);
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("compare_providers", JSON.stringify(updated));
    window.dispatchEvent(new Event("compare_updated"));
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem("compare_providers");
    window.dispatchEvent(new Event("compare_updated"));
  };

  if (items.length === 0) return null;

  const compareUrl = `/compare?ids=${items.map((i) => i.id).join(",")}`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-slate-900 text-white rounded-2xl p-3 shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 pl-2 shrink-0">
          <Scale className="w-4 h-4 text-blue-400" />
          <span>Compare ({items.length}/4):</span>
        </div>

        <div className="flex items-center gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-xs shrink-0"
            >
              <span className="font-medium max-w-[100px] truncate">{item.name}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1 rounded">
                {item.trustScore}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-white p-0.5"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pr-1">
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-slate-400 hover:text-white px-2 py-1"
        >
          Clear
        </button>
        <Link
          href={compareUrl}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs text-white transition shadow-sm ${
            items.length >= 2
              ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
              : "bg-slate-700 opacity-60 pointer-events-none"
          }`}
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
