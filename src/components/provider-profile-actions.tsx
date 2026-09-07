"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Phone,
  MessageSquare,
  Bookmark,
  Share2,
  AlertTriangle,
  Star,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

interface ProviderProfileActionsProps {
  providerId: string;
  providerName: string;
  phone: string;
  isSavedInitial?: boolean;
}

export function ProviderProfileActions({
  providerId,
  providerName,
  phone,
  isSavedInitial = false,
}: ProviderProfileActionsProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saveLoading, setSaveLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review Modal State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [rating, setRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [behaviorRating, setBehaviorRating] = useState(5);
  const [pricingRating, setPricingRating] = useState(5);
  const [timelinessRating, setTimelinessRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Report Modal State
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportCategory, setReportCategory] = useState("POOR_QUALITY");
  const [reportDescription, setReportDescription] = useState("");
  const [reportError, setReportError] = useState<string | null>(null);

  const logContact = async (type: "CALL" | "WHATSAPP") => {
    try {
      await fetch(`/api/providers/${providerId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch {}
  };

  const toggleSave = async () => {
    if (!session) {
      alert("Please sign in to save this provider to your favourites.");
      return;
    }
    setSaveLoading(true);
    try {
      const res = await fetch(`/api/providers/${providerId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      });
      if (res.ok) {
        setIsSaved(!isSaved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to leave a review.");
      return;
    }
    setReviewLoading(true);
    setReviewError(null);

    try {
      const res = await fetch(`/api/providers/${providerId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overallRating: rating,
          qualityRating,
          behaviorRating,
          pricingRating,
          timelinessRating,
          communicationRating,
          text: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || "Failed to submit review.");
        setReviewLoading(false);
        return;
      }

      setReviewSuccess(true);
      setTimeout(() => {
        setReviewOpen(false);
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to report an issue.");
      return;
    }
    setReportLoading(true);
    setReportError(null);

    try {
      const res = await fetch(`/api/providers/${providerId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: reportCategory,
          description: reportDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReportError(data.error || "Failed to submit report.");
        setReportLoading(false);
        return;
      }

      setReportSuccess(true);
      setTimeout(() => {
        setReportOpen(false);
        setReportSuccess(false);
        setReportDescription("");
      }, 2000);
    } catch (err: any) {
      setReportError(err.message || "Failed to submit report.");
    } finally {
      setReportLoading(false);
    }
  };

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "919837012345";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${providerName}, I found your verified profile on TrustLocal Dehradun and would like to check your availability.`
  )}`;

  return (
    <>
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`tel:${phone}`}
          onClick={() => logContact("CALL")}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow-sm"
        >
          <Phone className="w-4 h-4 text-blue-400" />
          <span>Call Provider</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logContact("WHATSAPP")}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={toggleSave}
          disabled={saveLoading}
          className={`p-3 rounded-xl border transition flex items-center justify-center gap-1.5 text-xs font-semibold ${
            isSaved
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          title={isSaved ? "Saved to favourites" : "Save provider"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
          <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition text-xs font-semibold flex items-center justify-center gap-1.5"
          title="Share profile link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
        </button>

        <button
          type="button"
          onClick={() => setReviewOpen(true)}
          className="p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 transition text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>Write Review</span>
        </button>

        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Report provider or fake claims"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>

      {/* 1. REVIEW MODAL */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Review {providerName}</h3>
                <p className="text-xs text-slate-500">Help the Dehradun community with honest feedback</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900">Review Submitted!</h4>
                <p className="text-xs text-slate-500">Thank you for contributing to local service transparency.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
                {reviewError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {reviewError}
                  </div>
                )}

                {/* Overall Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Overall Experience (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Structured Rating Dimensions */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
                    Detailed Ratings (Optional)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Work Quality:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQualityRating(s)}
                          className={`w-6 h-6 rounded-md font-bold text-xs ${
                            s <= qualityRating ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pricing Fairness:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPricingRating(s)}
                          className={`w-6 h-6 rounded-md font-bold text-xs ${
                            s <= pricingRating ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Punctuality / Timeliness:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTimelinessRating(s)}
                          className={`w-6 h-6 rounded-md font-bold text-xs ${
                            s <= timelinessRating ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Professional Behavior:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBehaviorRating(s)}
                          className={`w-6 h-6 rounded-md font-bold text-xs ${
                            s <= behaviorRating ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Written Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe what work was done, how punctual they were, whether pricing was transparent, and if you would recommend them..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Verified Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. REPORT / COMPLAINT MODAL */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Report Issue or Misleading Claim</h3>
              </div>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Complaint Logged</h4>
                <p className="text-xs text-slate-500">
                  Our admin verification team will investigate this report and take appropriate action.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 pt-4">
                {reportError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {reportError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category of Issue
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    {Object.entries(COMPLAINT_CATEGORIES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Details of the Incident / Misleading Claims
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide specific details about what occurred or why this profile contains false information..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
                  >
                    {reportLoading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
