"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

export function AdminVerificationActions({ verificationId }: { verificationId: string }) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState<string | null>(null);

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verifications/${verificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setResolved(status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (resolved) {
    return (
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded ${
          resolved === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}
      >
        {resolved}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction("APPROVED")}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Verify Badge</span>
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => handleAction("REJECTED")}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        <span>Reject</span>
      </button>
    </div>
  );
}
