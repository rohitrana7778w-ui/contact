import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Star,
  Layers,
  ArrowUpRight,
  Clock,
  AlertCircle,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { AvailabilityBadge } from "@/components/availability-badge";
import { ProviderTypeBadge } from "@/components/provider-type-badge";
import { formatDate } from "@/lib/utils";
import { ProviderDashboardClient } from "@/components/provider-dashboard-client";

export default async function ProviderDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: { userId: session.user.id },
    include: {
      verifications: true,
      portfolio: true,
      reviews: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      contactEvents: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!provider) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Provider Profile Missing</h2>
        <p className="text-xs text-slate-500">
          Your account is registered as a provider, but no business profile is linked yet.
        </p>
        <Link
          href="/register"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Complete Setup
        </Link>
      </div>
    );
  }

  const totalCalls = provider.contactEvents.filter((c) => c.type === "CALL").length;
  const totalWhatsApp = provider.contactEvents.filter((c) => c.type === "WHATSAPP").length;
  const totalInquiries = totalCalls + totalWhatsApp;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar & Approval Alert */}
      {!provider.isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Profile Pending Admin Review</span>
            <span>
              Your profile is currently being reviewed by our Dehradun operations team. You can still complete your profile, add portfolio evidence, and submit verification documents to speed up approval.
            </span>
          </div>
        </div>
      )}

      {/* Header with Title and Public Profile Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {provider.businessName}
            </h1>
            <ProviderTypeBadge type={provider.type} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Provider Dashboard · Dehradun Central
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/provider/${provider.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs transition"
          >
            <span>View Public Profile</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trust Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Trust Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{provider.trustScore}</span>
            <TrustScoreBadge score={provider.trustScore} size="sm" showLabel={false} />
          </div>
          <span className="text-[11px] text-slate-400 block">
            Target 90+ for &apos;Highly Trusted&apos; badge
          </span>
        </div>

        {/* Total Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Customer Inquiries</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalInquiries}</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Direct
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {totalCalls} Calls · {totalWhatsApp} WhatsApp clicks
          </span>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Completed Jobs</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">
              {provider.completedJobsCount}
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] text-slate-400 block">
            {provider.experienceYears}+ years in Dehradun
          </span>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">Reviews</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">
              {provider.reviews.length}
            </span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[11px] text-slate-400 block">
            Authentic customer feedback
          </span>
        </div>
      </div>

      {/* Interactive Controls & Inquiries */}
      <ProviderDashboardClient provider={provider as any} />
    </div>
  );
}
