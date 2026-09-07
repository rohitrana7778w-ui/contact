"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, AlertCircle, Layers, ShieldCheck, MapPin, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PortfolioProjectItem {
  id: string;
  title: string;
  projectType: string;
  locality: string | null;
  year: number | null;
  approxBudget: number | null;
  description: string;
  workPerformed: string | null;
  mediaUrls: string[];
  verificationStatus: "PENDING" | "APPROVED" | "VERIFIED" | "REJECTED";
}

interface ProviderPortfolioClientProps {
  providerId: string;
  projects: PortfolioProjectItem[];
}

export function ProviderPortfolioClient({
  providerId,
  projects = [],
}: ProviderPortfolioClientProps) {
  const [projectList, setProjectList] = useState(projects);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    projectType: "",
    locality: "Dehradun",
    year: new Date().getFullYear().toString(),
    approxBudget: "",
    description: "",
    workPerformed: "",
    mediaUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/provider/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          approxBudget: form.approxBudget ? Number(form.approxBudget) : null,
          mediaUrls: form.mediaUrl ? [form.mediaUrl] : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add project");
      }

      setProjectList([data.project, ...projectList]);
      setModalOpen(false);
      setForm({
        title: "",
        projectType: "",
        locality: "Dehradun",
        year: new Date().getFullYear().toString(),
        approxBudget: "",
        description: "",
        workPerformed: "",
        mediaUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-900">{projectList.length}</span> projects documented.
          {projectList.length >= 3 ? (
            <span className="text-emerald-600 font-semibold ml-1">✓ +15 Trust Score criteria met!</span>
          ) : (
            <span className="text-blue-600 font-semibold ml-1">
              Add {3 - projectList.length} more to unlock max portfolio trust points.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Completed Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectList.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {proj.mediaUrls && proj.mediaUrls.length > 0 && (
              <div className="relative h-44 w-full bg-slate-100">
                <Image
                  src={proj.mediaUrls[0]}
                  alt={proj.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  {proj.verificationStatus === "VERIFIED" || proj.verificationStatus === "APPROVED" ? (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Pending Review
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 space-y-2 flex-1">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                {proj.projectType}
              </span>
              <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{proj.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{proj.locality || "Dehradun"}</span>
              </span>
              {proj.approxBudget && (
                <span className="font-bold text-slate-800 text-xs">
                  {formatPrice(proj.approxBudget)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Document Completed Job</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Full Villa AC Inverter Wiring at Rajpur"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Project Type
                  </label>
                  <input
                    type="text"
                    required
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    placeholder="e.g. AC Installation, Rewiring"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Approx Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="approxBudget"
                    value={form.approxBudget}
                    onChange={handleChange}
                    placeholder="e.g. 15000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Locality in Dehradun
                  </label>
                  <input
                    type="text"
                    name="locality"
                    value={form.locality}
                    onChange={handleChange}
                    placeholder="e.g. Jakhan, Canal Road"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Year Completed
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Performed & Scope
                </label>
                <textarea
                  required
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the problem you solved, materials used, testing steps, and execution timeline..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Photograph Image URL
                </label>
                <input
                  type="url"
                  name="mediaUrl"
                  value={form.mediaUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add to Portfolio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
