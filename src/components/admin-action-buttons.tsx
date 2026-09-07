"use client";

import React, { useState } from "react";
import { Check, X, ShieldAlert, Power } from "lucide-react";

interface AdminActionButtonsProps {
  providerId: string;
  isApproved: boolean;
  isActive?: boolean;
}

export function AdminActionButtons({
  providerId,
  isApproved,
  isActive = true,
}: AdminActionButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isApproved, isActive });

  const handleAction = async (action: "APPROVE" | "REJECT" | "SUSPEND" | "ACTIVATE") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/providers/${providerId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        if (action === "APPROVE") setStatus({ isApproved: true, isActive: true });
        if (action === "REJECT") setStatus({ isApproved: false, isActive: false });
        if (action === "SUSPEND") setStatus({ ...status, isActive: false });
        if (action === "ACTIVATE") setStatus({ isApproved: true, isActive: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {!status.isApproved ? (
        <>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("APPROVE")}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction("REJECT")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        </>
      ) : status.isActive ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleAction("SUSPEND")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs transition"
          title="Temporarily suspend from search"
        >
          <Power className="w-3.5 h-3.5 text-amber-600" />
          <span>Suspend</span>
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleAction("ACTIVATE")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Reactivate</span>
        </button>
      )}
    </div>
  );
}
