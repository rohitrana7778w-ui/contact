"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Star,
  Send,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProviderDashboardClientProps {
  provider: {
    id: string;
    availability: "AVAILABLE" | "ACCEPTING" | "BUSY" | "UNAVAILABLE";
    trustScore: number;
    contactEvents: Array<{
      id: string;
      type: "CALL" | "WHATSAPP";
      createdAt: string;
    }>;
    reviews: Array<{
      id: string;
      overallRating: number;
      text: string;
      createdAt: string;
      customer: { name: string };
      providerResponse?: string | null;
    }>;
  };
}

export function ProviderDashboardClient({ provider }: ProviderDashboardClientProps) {
  const [currentAvailability, setCurrentAvailability] = useState(provider.availability);
  const [updating, setUpdating] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const handleAvailabilityChange = async (newStatus: "AVAILABLE" | "ACCEPTING" | "BUSY" | "UNAVAILABLE") => {
    setUpdating(true);
    try {
      const res = await fetch("/api/provider/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: newStatus }),
      });
      if (res.ok) {
        setCurrentAvailability(newStatus);
      }
    } catch (e) {
      console.error("Availability update error:", e);
    } finally {
      setUpdating(false);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text || text.trim().length < 4) return;

    setReplyingId(reviewId);
    try {
      const res = await fetch(`/api/provider/reviews/${reviewId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: text.trim() }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Availability + Inquiries + Reviews */}
      <div className="lg:col-span-2 space-y-6">
        {/* Availability Switcher Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Real-Time Job Availability Status</span>
            </div>
            {updating && <span className="text-[10px] text-blue-600 animate-pulse">Saving...</span>}
          </div>
          <p className="text-xs text-slate-500">
            Let Dehradun customers know if you can take jobs right now or are booked this week.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAvailabilityChange("AVAILABLE")}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                currentAvailability === "AVAILABLE"
                  ? "bg-green-50 border-green-300 text-green-800 ring-2 ring-green-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              🟢 Available Now
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityChange("ACCEPTING")}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                currentAvailability === "ACCEPTING"
                  ? "bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              🔵 Accepting Jobs
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityChange("BUSY")}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                currentAvailability === "BUSY"
                  ? "bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              🟠 Busy This Week
            </button>

            <button
              type="button"
              onClick={() => handleAvailabilityChange("UNAVAILABLE")}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                currentAvailability === "UNAVAILABLE"
                  ? "bg-gray-100 border-gray-300 text-gray-800 ring-2 ring-gray-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              ⚪ On Leave
            </button>
          </div>
        </div>

        {/* Customer Inquiries Feed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>Recent Inquiries</span>
            </h3>
            <span className="text-[11px] text-slate-400">Direct phone & WhatsApp clicks</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {provider.contactEvents.length > 0 ? (
              provider.contactEvents.map((evt) => (
                <div key={evt.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        evt.type === "CALL"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {evt.type === "CALL" ? (
                        <PhoneCall className="w-3.5 h-3.5" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">
                        {evt.type === "CALL" ? "Phone Call Click" : "WhatsApp Chat Inquiry"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Dehradun Customer</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{formatDate(evt.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                No inquiries recorded yet. Make sure your profile has complete details and portfolio photos!
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews with Quick Reply */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Recent Customer Reviews</span>
          </h3>

          <div className="space-y-4">
            {provider.reviews.length > 0 ? (
              provider.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.customer.name}</span>
                    <span className="text-amber-500 font-bold">{rev.overallRating} ★</span>
                  </div>
                  <p className="text-slate-600 italic">&quot;{rev.text}&quot;</p>

                  {rev.providerResponse ? (
                    <div className="p-2.5 rounded-lg bg-blue-50 border-l-2 border-blue-600 text-[11px] text-blue-900">
                      <span className="font-semibold block">Your Reply:</span>
                      <span>{rev.providerResponse}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a professional reply to this customer..."
                        value={replyInputs[rev.id] || ""}
                        onChange={(e) =>
                          setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })
                        }
                        className="flex-1 p-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleReplySubmit(rev.id)}
                        disabled={replyingId === rev.id}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
                      >
                        {replyingId === rev.id ? "Sending..." : "Reply"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                No customer reviews yet. Reviews will automatically boost your Trust Score!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Trust Score Action Center */}
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How to Reach 90+ Trust Score</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Higher Trust Scores position you at the top of organic search results in Dehradun.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Phone Verified</span>
                <span className="text-[11px] text-slate-500">+5 Trust Points</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Submit Govt / Trade ID</span>
                <span className="text-[11px] text-slate-500">+10 Points for Aadhaar or Business GST</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Upload 3+ Project Photos</span>
                <span className="text-[11px] text-slate-500">+15 Points for verified work portfolio</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 block">Collect Verified Reviews</span>
                <span className="text-[11px] text-slate-500">+15 Points for genuine client feedback</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <a
              href="/dashboard/provider/verification"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              <span>Submit Verification Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
