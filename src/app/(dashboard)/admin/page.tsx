import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ShieldAlert,
  Users,
  FileCheck,
  AlertTriangle,
  Check,
  X,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { AdminActionButtons } from "@/components/admin-action-buttons";
import { formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [
    totalProviders,
    pendingProviders,
    pendingVerifications,
    openComplaints,
    totalCustomers,
  ] = await Promise.all([
    prisma.provider.count(),
    prisma.provider.count({ where: { isApproved: false } }),
    prisma.verification.count({ where: { status: "PENDING" } }),
    prisma.complaint.count({ where: { status: "OPEN" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  // Fetch pending providers for quick approval
  const pendingProvidersList = await prisma.provider.findMany({
    where: { isApproved: false },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  // Fetch open complaints
  const openComplaintsList = await prisma.complaint.findMany({
    where: { status: "OPEN" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { businessName: true, slug: true } },
      reporter: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Trust & Operations Command Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dehradun Pilot Platform · Moderation, Verification, and Safety Auditing
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Pending Provider Approvals</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{pendingProviders}</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-400 block">Requires identity review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Verification Requests</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-blue-600">{pendingVerifications}</span>
            <FileCheck className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-[11px] text-slate-400 block">Pending document verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Open Safety Complaints</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-red-600">{openComplaints}</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-[11px] text-slate-400 block">Disputes & fraud reports</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Total Network Providers</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalProviders}</span>
            <span className="text-xs font-bold text-slate-400">Dehradun</span>
          </div>
          <span className="text-[11px] text-slate-400 block">{totalCustomers} Registered Customers</span>
        </div>
      </div>

      {/* 1. Pending Approvals Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              New Provider Applications Awaiting Approval
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Providers cannot appear in public search until approved by admin
            </p>
          </div>
          <Link
            href="/admin/providers"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All ({pendingProviders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {pendingProvidersList.length > 0 ? (
            pendingProvidersList.map((p) => (
              <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{p.businessName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {p.type}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Contact: <span className="font-medium text-slate-800">{p.user.name}</span> ({p.user.phone || p.user.email})
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{p.locality || "Dehradun"} · {p.experienceYears} yrs experience</span>
                  </div>
                </div>

                <AdminActionButtons providerId={p.id} isApproved={p.isApproved} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              No pending applications. All providers are reviewed!
            </div>
          )}
        </div>
      </div>

      {/* 2. Open Complaints & Safety Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Open Complaints & Trust Violations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Investigate fake reviews, fraudulent claims, or poor behavior reports
            </p>
          </div>
          <Link
            href="/admin/complaints"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Manage Complaints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {openComplaintsList.length > 0 ? (
            openComplaintsList.map((c) => (
              <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px]">
                      {c.category}
                    </span>
                    <span className="text-slate-400">against</span>
                    <Link
                      href={`/provider/${c.provider.slug}`}
                      className="font-bold text-slate-900 hover:underline"
                    >
                      {c.provider.businessName}
                    </Link>
                  </div>
                  <p className="text-slate-600 italic">&quot;{c.description}&quot;</p>
                  <span className="text-[11px] text-slate-400">
                    Reported by {c.reporter.name} on {formatDate(c.createdAt)}
                  </span>
                </div>

                <Link
                  href="/admin/complaints"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs shrink-0"
                >
                  Review & Resolve
                </Link>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              No open complaints. Platform safety is clean!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
