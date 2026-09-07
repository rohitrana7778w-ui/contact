"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { getTrustLevel } from "@/lib/constants";

interface TrustScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showInfo?: boolean;
}

export function TrustScoreBadge({
  score,
  size = "md",
  showLabel = true,
  showInfo = false,
}: TrustScoreBadgeProps) {
  const level = getTrustLevel(score);

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${level.color}`}
        title={`Trust Score: ${score}/100 — ${level.label}`}
      >
        <ShieldCheck className="w-3 h-3" />
        <span>{score}</span>
        {showLabel && <span className="text-[10px] font-medium opacity-90">({level.label})</span>}
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${level.color} shadow-sm`}>
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-inner font-extrabold text-xl">
          {score}
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Trust Score</span>
            <span className="opacity-60 text-[10px]">/ 100</span>
          </div>
          <div className="font-semibold text-sm mt-0.5">
            {level.label}
          </div>
        </div>
      </div>
    );
  }

  // Medium (default)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${level.color}`}
      title={`Trust Score: ${score}/100 — ${level.label}`}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>{score}/100</span>
      {showLabel && <span className="font-medium">· {level.label}</span>}
      {showInfo && <Info className="w-3 h-3 opacity-60 ml-0.5" />}
    </div>
  );
}
