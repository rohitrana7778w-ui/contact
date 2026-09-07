"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";

interface ProviderProfileFormProps {
  provider: {
    id: string;
    businessName: string;
    type: string;
    description: string;
    locality: string | null;
    serviceArea: string;
    experienceYears: number;
    specializations: string[];
    pricing: any;
  };
}

export function ProviderProfileForm({ provider }: ProviderProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: provider.businessName,
    type: provider.type,
    description: provider.description,
    locality: provider.locality || "Dehradun",
    serviceArea: provider.serviceArea,
    experienceYears: provider.experienceYears,
    specializations: provider.specializations.join(", "),
    startingPrice: provider.pricing?.startingPrice || "",
    visitCharge: provider.pricing?.visitCharge || "",
    pricingType: provider.pricing?.pricingType || "LABOUR_ONLY",
    pricingNotes: provider.pricing?.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/provider/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          type: formData.type,
          description: formData.description,
          locality: formData.locality,
          serviceArea: formData.serviceArea,
          experienceYears: Number(formData.experienceYears),
          specializations: formData.specializations
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          pricing: {
            startingPrice: formData.startingPrice ? Number(formData.startingPrice) : null,
            visitCharge: formData.visitCharge ? Number(formData.visitCharge) : null,
            pricingType: formData.pricingType,
            notes: formData.pricingNotes,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile.");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile and pricing updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Core Profile */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Business & Identification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Business / Trade Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Provider Category Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
            >
              <option value="INDIVIDUAL">Individual Technician / Worker</option>
              <option value="SHOP">Professional Shop / Business</option>
              <option value="COMPANY">Service Company</option>
              <option value="CONTRACTOR">Contractor / Team</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            About & Experience Summary
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Locality in Dehradun
            </label>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Rajpur Road, Jakhan"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Service Area Radius
            </label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              placeholder="e.g. Within 15 km of Clock Tower"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Specializations (Comma separated)
          </label>
          <input
            type="text"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            placeholder="e.g. Inverter AC Circuit, Copper Piping, R32 Gas Refill"
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      {/* 2. Pricing Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Pricing Transparency Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Starting Service Fee (₹)
            </label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              placeholder="e.g. 350"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Visit / Inspection Charge (₹)
            </label>
            <input
              type="number"
              name="visitCharge"
              value={formData.visitCharge}
              onChange={handleChange}
              placeholder="e.g. 150 (or 0 for free)"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pricing Model
            </label>
            <select
              name="pricingType"
              value={formData.pricingType}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
            >
              <option value="LABOUR_ONLY">Labour Only (Parts Extra)</option>
              <option value="LABOUR_PLUS_MATERIAL">Labour + Material Included</option>
              <option value="PER_SERVICE">Fixed Per Service</option>
              <option value="PROJECT_BASED">Project Based (Custom Quote)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Pricing Notes & Inclusions / Exclusions
          </label>
          <input
            type="text"
            name="pricingNotes"
            value={formData.pricingNotes}
            onChange={handleChange}
            placeholder="e.g. Visit charge waived if service taken. Spare parts charged at actual bill cost."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Profile & Update Trust Score"}
        </button>
      </div>
    </form>
  );
}
