"use client";

import React, { useState } from "react";
import { Check, X, ShieldAlert } from "lucide-react";

export function AdminComplaintActions({ complaintId }: { complaintId: string }) {
  const [loading, setLoading] = useState(false);
  const [resolvedStatus, setResolvedStatus] = useState<string | null>(null);

  const handleAction = async (status: "RESOLVED" | "REJECTED") => {
    setLoading(true);
    try {
      const resolution =
        status === "RESOLVED"
          ? "Valid complaint. Trust Score deduction applied to provider."
          : "Complaint dismissed after review.";

      const res = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolution }),
      });

      if (res.ok) {
        setResolvedStatus(status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (resolvedStatus) {
    return (
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded ${
          resolvedStatus === "RESOLVED"
            ? "bg-red-50 text-red-700"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {resolvedStatus === "RESOLVED" ? "Resolved (Penalized)" : "Dismissed"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction("RESOLVED")}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition disabled:opacity-50"
        title="Uphold complaint & deduct Trust Score"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Uphold & Penalize</span>
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction("REJECTED")}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        <span>Dismiss</span>
      </button>
    </div>
  );
}
