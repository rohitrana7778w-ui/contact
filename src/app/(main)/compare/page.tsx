import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  ShieldCheck,
  MapPin,
  Briefcase,
  CheckCircle2,
  Phone,
  MessageSquare,
  ArrowRight,
  IndianRupee,
  Layers,
  Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { ProviderTypeBadge } from "@/components/provider-type-badge";
import { AvailabilityBadge } from "@/components/availability-badge";
import { VerificationBadges } from "@/components/verification-badges";
import { RatingStars } from "@/components/rating-stars";
import { formatPrice } from "@/lib/utils";

interface ComparePageProps {
  searchParams: {
    ids?: string;
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const idsString = searchParams.ids || "";
  const providerIds = idsString.split(",").map((s) => s.trim()).filter(Boolean);

  let providers: any[] = [];
  let availableProviders: any[] = [];

  try {
    if (providerIds.length > 0) {
      providers = await prisma.provider.findMany({
        where: { id: { in: providerIds }, isApproved: true },
        include: {
          verifications: true,
          portfolio: true,
          reviews: true,
          user: { select: { phone: true } },
        },
      });
    }

    // Also get all available providers so the user can easily add them to comparison
    availableProviders = await prisma.provider.findMany({
      where: { isApproved: true, isActive: true },
      take: 8,
      orderBy: { trustScore: "desc" },
      select: {
        id: true,
        businessName: true,
        type: true,
        trustScore: true,
        locality: true,
        avatarUrl: true,
      },
    });
  } catch (err) {
    console.error("Compare error:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Structured Comparison Tool</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Skilled Professionals Side by Side
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Evaluate Trust Scores, verifiable project evidence, rates, and availability to make the right decision for your home or project.
          </p>
        </div>

        {providers.length < 2 ? (
          /* Empty or single state with quick-select */
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Select at least 2 providers to compare
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                You can pick providers from search results or click any below to start comparing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {availableProviders.map((ap) => {
                const isSelected = providerIds.includes(ap.id);
                const nextIds = isSelected
                  ? providerIds.filter((id) => id !== ap.id)
                  : [...providerIds, ap.id].slice(0, 4);

                return (
                  <Link
                    key={ap.id}
                    href={`/compare?ids=${nextIds.join(",")}`}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-900 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={ap.avatarUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150"}
                          alt={ap.businessName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block truncate max-w-[160px]">
                          {ap.businessName}
                        </span>
                        <span className="text-[11px] text-slate-500">{ap.locality || "Dehradun"}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <TrustScoreBadge score={ap.trustScore} size="sm" showLabel={false} />
                      <span className="text-[10px] font-bold text-blue-600 block mt-1">
                        {isSelected ? "✓ Added" : "+ Select"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
              >
                <span>Browse All Providers in Dehradun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Detailed Comparison Matrix Table */
          <div className="space-y-6">
            {/* Quick Picker Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                Comparing {providers.length} of max 4 providers
              </span>
              <div className="flex gap-2">
                <Link
                  href="/search"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  + Add More
                </Link>
                <Link
                  href="/compare"
                  className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 font-medium"
                >
                  Reset
                </Link>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                {/* 1. Profile Header Row */}
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-4 w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Provider
                    </th>
                    {providers.map((p) => (
                      <th key={p.id} className="p-4 w-64 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ProviderTypeBadge type={p.type} />
                            <AvailabilityBadge status={p.availability} />
                          </div>
                          <Link
                            href={`/provider/${p.slug}`}
                            className="font-extrabold text-slate-900 text-base hover:text-blue-600 block line-clamp-1"
                          >
                            {p.businessName}
                          </Link>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{p.locality || "Dehradun"}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Row: Trust Score */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Trust Score (0–100)
                    </td>
                    {providers.map((p) => (
                      <td key={p.id} className="p-4">
                        <TrustScoreBadge score={p.trustScore} size="md" />
                      </td>
                    ))}
                  </tr>

                  {/* Row: Ratings & Reviews */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Customer Rating
                    </td>
                    {providers.map((p) => {
                      const count = p.reviews.length;
                      const avg =
                        count > 0
                          ? p.reviews.reduce((s: number, r: any) => s + r.overallRating, 0) / count
                          : 5.0;
                      return (
                        <td key={p.id} className="p-4">
                          <RatingStars rating={avg} reviewsCount={count} size="sm" />
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Experience & Completed Jobs */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Field Experience
                    </td>
                    {providers.map((p) => (
                      <td key={p.id} className="p-4 text-slate-800">
                        <span className="font-extrabold text-sm block">
                          {p.experienceYears}+ Years
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {p.completedJobsCount} jobs completed
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Pricing Transparency */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Pricing Structure
                    </td>
                    {providers.map((p) => {
                      const pr = p.pricing as any;
                      return (
                        <td key={p.id} className="p-4 space-y-1">
                          <div className="font-bold text-slate-900 text-sm">
                            {pr?.startingPrice ? formatPrice(pr.startingPrice) : "On Inspection"}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Visit charge: {pr?.visitCharge ? formatPrice(pr.visitCharge) : "Free / Waived"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {pr?.pricingType?.replace(/_/g, " ") || "Labour Only"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Verification Badges */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Admin Verifications
                    </td>
                    {providers.map((p) => (
                      <td key={p.id} className="p-4">
                        <VerificationBadges verifications={p.verifications} maxDisplay={4} />
                      </td>
                    ))}
                  </tr>

                  {/* Row: Portfolio Count */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Verified Portfolio
                    </td>
                    {providers.map((p) => (
                      <td key={p.id} className="p-4 text-slate-800 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>{p.portfolio.length} Projects Documented</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Specializations */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                      Key Specializations
                    </td>
                    {providers.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.specializations?.slice(0, 3).map((spec: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Direct Contact CTAs */}
                  <tr className="bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-900">
                      Direct Action
                    </td>
                    {providers.map((p) => {
                      const phone = p.user?.phone || "+919837012345";
                      const cleanPhone = phone.replace(/[^0-9]/g, "");
                      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Hello ${p.businessName}, I am comparing services on TrustLocal Dehradun and would like to contact you.`
                      )}`;

                      return (
                        <td key={p.id} className="p-4">
                          <div className="flex flex-col gap-2">
                            <a
                              href={`tel:${phone}`}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                            >
                              <Phone className="w-3.5 h-3.5 text-blue-400" />
                              <span>Call Direct</span>
                            </a>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <Link
                              href={`/provider/${p.slug}`}
                              className="text-center text-xs font-semibold text-blue-600 hover:underline py-1"
                            >
                              View Full Profile →
                            </Link>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
