import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Layers,
  Star,
  MessageSquare,
  AlertCircle,
  Building,
  UserCheck,
} from "lucide-react";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { ProviderTypeBadge } from "@/components/provider-type-badge";
import { AvailabilityBadge } from "@/components/availability-badge";
import { VerificationBadges } from "@/components/verification-badges";
import { RatingStars } from "@/components/rating-stars";
import { ProviderProfileActions } from "@/components/provider-profile-actions";
import { formatPrice, formatDate } from "@/lib/utils";

interface ProviderProfilePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProviderProfilePageProps) {
  const provider = await prisma.provider.findUnique({
    where: { slug: params.slug },
    select: { businessName: true, description: true, locality: true },
  });

  if (!provider) return { title: "Provider Not Found — TrustLocal" };

  return {
    title: `${provider.businessName} — Verified Skilled Services in Dehradun | TrustLocal`,
    description: provider.description.slice(0, 160),
  };
}

export default async function ProviderProfilePage({ params }: ProviderProfilePageProps) {
  const session = await getServerSession(authOptions);

  const provider = await prisma.provider.findUnique({
    where: { slug: params.slug },
    include: {
      user: {
        select: { phone: true, email: true },
      },
      verifications: true,
      portfolio: {
        orderBy: { createdAt: "desc" },
      },
      services: {
        include: {
          service: {
            include: { category: true },
          },
        },
      },
      reviews: {
        include: {
          customer: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      savedBy: session?.user?.id
        ? {
            where: { customerId: session.user.id },
          }
        : false,
    },
  });

  if (!provider) {
    notFound();
  }

  const isSaved = session?.user?.id ? (provider.savedBy && provider.savedBy.length > 0) : false;

  // Compute review statistics
  const reviewCount = provider.reviews.length;
  const avgOverall =
    reviewCount > 0
      ? provider.reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
      : 5.0;

  const avgQuality =
    reviewCount > 0
      ? provider.reviews.filter((r) => r.qualityRating).reduce((s, r) => s + (r.qualityRating || 0), 0) /
        (provider.reviews.filter((r) => r.qualityRating).length || 1)
      : 5;

  const avgPricing =
    reviewCount > 0
      ? provider.reviews.filter((r) => r.pricingRating).reduce((s, r) => s + (r.pricingRating || 0), 0) /
        (provider.reviews.filter((r) => r.pricingRating).length || 1)
      : 5;

  const avgTimeliness =
    reviewCount > 0
      ? provider.reviews.filter((r) => r.timelinessRating).reduce((s, r) => s + (r.timelinessRating || 0), 0) /
        (provider.reviews.filter((r) => r.timelinessRating).length || 1)
      : 5;

  const avgBehavior =
    reviewCount > 0
      ? provider.reviews.filter((r) => r.behaviorRating).reduce((s, r) => s + (r.behaviorRating || 0), 0) /
        (provider.reviews.filter((r) => r.behaviorRating).length || 1)
      : 5;

  const pricingData = provider.pricing as any;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-blue-600">Dehradun Services</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">{provider.businessName}</span>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md shrink-0">
                <Image
                  src={
                    provider.avatarUrl ||
                    "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300"
                  }
                  alt={provider.businessName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Identity & Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <ProviderTypeBadge type={provider.type} />
                  <AvailabilityBadge status={provider.availability} />
                  <span className="text-xs text-slate-500 font-medium">
                    {provider.completedJobsCount} jobs completed
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {provider.businessName}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{provider.locality ? `${provider.locality}, Dehradun` : "Dehradun"}</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>{provider.experienceYears}+ Years Field Experience</span>
                  <span className="text-slate-300">·</span>
                  <RatingStars rating={avgOverall} reviewsCount={reviewCount} size="sm" />
                </div>

                {/* Verification badges list */}
                <div className="pt-1">
                  <VerificationBadges verifications={provider.verifications as any} />
                </div>
              </div>
            </div>

            {/* Trust Score Display Card */}
            <div className="shrink-0 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-row md:flex-col items-center justify-between gap-4">
              <TrustScoreBadge score={provider.trustScore} size="lg" showLabel={true} />
              <div className="text-[11px] text-slate-500 text-center max-w-[180px]">
                Audited evidence-based score. Cannot be purchased.
              </div>
            </div>
          </div>

          {/* Quick Action CTA Row */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct communication — no middleman booking fees</span>
            </div>

            <ProviderProfileActions
              providerId={provider.id}
              providerName={provider.businessName}
              phone={provider.user?.phone || "+919837012345"}
              isSavedInitial={isSaved}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Detailed Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. About / Description */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>About & Professional Experience</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {provider.description}
              </p>

              {/* Specializations */}
              {provider.specializations && provider.specializations.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Core Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.specializations.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 2. Services & Pricing */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <span>Services & Pricing Transparency</span>
              </h2>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-xs text-slate-500 block">Starting Service Fee</span>
                  <span className="text-lg font-extrabold text-slate-900 block mt-1">
                    {pricingData?.startingPrice ? formatPrice(pricingData.startingPrice) : "On Inspection"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-xs text-slate-500 block">Visit & Inspection Charge</span>
                  <span className="text-lg font-extrabold text-slate-900 block mt-1">
                    {pricingData?.visitCharge ? formatPrice(pricingData.visitCharge) : "Free / Waived"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-xs text-slate-500 block">Billing Type</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1 uppercase">
                    {pricingData?.pricingType?.replace(/_/g, " ") || "Labour Only"}
                  </span>
                </div>
              </div>

              {pricingData?.notes && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{pricingData.notes}</span>
                </div>
              )}

              {/* Associated Services */}
              {provider.services && provider.services.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Registered Service Offerings
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {provider.services.map((ps) => (
                      <div key={ps.id} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{ps.service.name}</span>
                        {ps.customPrice && (
                          <span className="font-bold text-slate-900">
                            {formatPrice(ps.customPrice)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 3. Verified Portfolio & Work Evidence */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Verified Completed Work & Portfolio</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real jobs executed in Dehradun with client sign-off
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {provider.portfolio.length} Projects
                </span>
              </div>

              {provider.portfolio && provider.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {provider.portfolio.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 flex flex-col justify-between"
                    >
                      {proj.mediaUrls && proj.mediaUrls.length > 0 && (
                        <div className="relative h-44 w-full bg-slate-200">
                          <Image
                            src={proj.mediaUrls[0]}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                          {proj.verificationStatus === "VERIFIED" && (
                            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Work</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-sm text-slate-900">{proj.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>

                        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                          <span>📍 {proj.locality || "Dehradun"}</span>
                          {proj.approxBudget && (
                            <span className="font-bold text-slate-800">
                              {formatPrice(proj.approxBudget)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  No portfolio projects uploaded yet.
                </div>
              )}
            </section>

            {/* 4. Customer Reviews & Ratings */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Customer Reviews ({reviewCount})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic feedback from verified customers
                  </p>
                </div>
              </div>

              {/* Rating Dimensions Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <div>
                  <span className="text-[11px] text-slate-500 block">Work Quality</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    {avgQuality.toFixed(1)} / 5
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Fair Pricing</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    {avgPricing.toFixed(1)} / 5
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Punctuality</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    {avgTimeliness.toFixed(1)} / 5
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Behavior</span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    {avgBehavior.toFixed(1)} / 5
                  </span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {provider.reviews && provider.reviews.length > 0 ? (
                  provider.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                            {rev.customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{rev.customer.name}</span>
                              {rev.isVerified && (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                  ✓ Verified Job
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(rev.createdAt)}
                            </span>
                          </div>
                        </div>

                        <RatingStars rating={rev.overallRating} size="sm" showValue={false} />
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{rev.text}</p>

                      {/* Provider reply if present */}
                      {rev.providerResponse && (
                        <div className="p-3 rounded-lg bg-slate-50 border-l-2 border-blue-600 text-xs space-y-1">
                          <span className="font-semibold text-slate-800 block text-[11px]">
                            Response from {provider.businessName}:
                          </span>
                          <p className="text-slate-600 italic">{rev.providerResponse}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No customer reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Operational & Trust Breakdown Sidebar */}
          <div className="space-y-6">
            {/* Trust Score Breakdown Inspector */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Trust Score Audit (0 – 100)</span>
              </div>
              <p className="text-xs text-slate-500">
                A composite score derived from verifiable platform evidence, not sponsorship.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Identity & Trade Check</span>
                  <span className="font-semibold text-emerald-600">Verified (+20)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Location / Shop Visit</span>
                  <span className="font-semibold text-emerald-600">Verified (+10)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Completed Work History</span>
                  <span className="font-semibold text-blue-600">{provider.completedJobsCount} Jobs (+15)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Portfolio Evidence</span>
                  <span className="font-semibold text-blue-600">{provider.portfolio.length} Projects (+15)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Verified Customer Reviews</span>
                  <span className="font-semibold text-blue-600">{reviewCount} Reviews (+15)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Dispute / Fraud Deductions</span>
                  <span className="font-semibold text-slate-500">0 Deductions (Clean)</span>
                </div>
              </div>
            </div>

            {/* Service Area & Location */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Service Coverage Area</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {provider.serviceArea}
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Base location: <span className="font-semibold text-slate-800">{provider.locality || "Dehradun"}</span>
              </div>
            </div>

            {/* Working Hours Schedule */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Working Hours & Schedule</span>
              </div>

              <div className="text-xs space-y-2 pt-2 border-t border-slate-100 text-slate-600">
                <div className="flex justify-between">
                  <span>Monday – Saturday:</span>
                  <span className="font-semibold text-slate-900">8:30 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold text-slate-900">Emergency / Half Day</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Current status: <AvailabilityBadge status={provider.availability} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
