"use client";

import React, { useState } from "react";
import {
  Phone,
  ShieldCheck,
  MapPin,
  Briefcase,
  CheckCircle2,
  Users,
  Building,
  Upload,
  Check,
  Clock,
  XCircle,
} from "lucide-react";
import { VERIFICATION_TYPES } from "@/lib/constants";

interface VerificationItem {
  type: keyof typeof VERIFICATION_TYPES;
  status: "PENDING" | "APPROVED" | "REJECTED";
  evidence?: string | null;
  notes?: string | null;
}

interface ProviderVerificationClientProps {
  providerId: string;
  verifications: VerificationItem[];
}

const ICONS: Record<string, React.ElementType> = {
  Phone,
  ShieldCheck,
  MapPin,
  Briefcase,
  CheckCircle2,
  Users,
  Building,
};

export function ProviderVerificationClient({
  providerId,
  verifications = [],
}: ProviderVerificationClientProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [evidenceText, setEvidenceText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatus = (type: string) => {
    return verifications.find((v) => v.type === type)?.status || "UNSUBMITTED";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !evidenceText.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/provider/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          evidence: evidenceText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit verification");
      }

      setSuccess("Verification details submitted for admin review!");
      setSelectedType(null);
      setEvidenceText("");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Verification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(VERIFICATION_TYPES).map(([typeKey, config]) => {
          const status = getStatus(typeKey);
          const Icon = ICONS[config.icon] || ShieldCheck;

          return (
            <div
              key={typeKey}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>

                  {status === "APPROVED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}

                  {status === "PENDING" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>In Review</span>
                    </span>
                  )}

                  {status === "REJECTED" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                      <XCircle className="w-3 h-3" />
                      <span>Resubmit Required</span>
                    </span>
                  )}

                  {status === "UNSUBMITTED" && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Not Submitted
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900">{config.label}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {config.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {status === "APPROVED" ? "Active on public profile" : "Awaits admin review"}
                </span>

                {status !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType(typeKey);
                      setError(null);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {status === "PENDING" ? "Update Details" : "Submit Proof"} →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Drawer / Modal */}
      {selectedType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in-50 zoom-in-95">
            <h3 className="font-bold text-base text-slate-900">
              Submit {VERIFICATION_TYPES[selectedType as keyof typeof VERIFICATION_TYPES]?.label}
            </h3>
            <p className="text-xs text-slate-500">
              Provide verifiable document details (e.g. Aadhaar number / Trade Certificate ID / Electricity Consumer No. for shop address).
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Verification Evidence / Reference Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="e.g. Electricity Bill Consumer #123456 at Rajpur Road, or GSTIN 05AAAAA0000A1Z5..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
