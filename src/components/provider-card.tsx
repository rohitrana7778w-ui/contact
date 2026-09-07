"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  Phone,
  MessageSquare,
  Scale,
  Check,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { TrustScoreBadge } from "./trust-score-badge";
import { ProviderTypeBadge } from "./provider-type-badge";
import { AvailabilityBadge } from "./availability-badge";
import { RatingStars } from "./rating-stars";
import { VerificationBadges, VerificationItem } from "./verification-badges";
import { formatPrice } from "@/lib/utils";

export interface ProviderCardData {
  id: string;
  slug: string;
  businessName: string;
  type: "INDIVIDUAL" | "SHOP" | "COMPANY" | "CONTRACTOR";
  avatarUrl?: string | null;
  locality?: string | null;
  city: string;
  serviceArea: string;
  experienceYears: number;
  completedJobsCount: number;
  trustScore: number;
  availability: "AVAILABLE" | "ACCEPTING" | "BUSY" | "UNAVAILABLE";
  specializations: string[];
  pricing?: {
    startingPrice?: number | null;
    visitCharge?: number | null;
    hourlyRate?: number | null;
    notes?: string | null;
  } | null;
  averageRating?: number;
  reviewCount?: number;
  verifications?: VerificationItem[];
  user?: {
    phone?: string | null;
  };
}

interface ProviderCardProps {
  provider: ProviderCardData;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [isCompared, setIsCompared] = useState(false);

  const checkCompareStatus = () => {
    try {
      const stored = localStorage.getItem("compare_providers");
      if (stored) {
        const list = JSON.parse(stored);
        setIsCompared(list.some((item: any) => item.id === provider.id));
      } else {
        setIsCompared(false);
      }
    } catch {
      setIsCompared(false);
    }
  };

  useEffect(() => {
    checkCompareStatus();
    window.addEventListener("compare_updated", checkCompareStatus);
    return () => window.removeEventListener("compare_updated", checkCompareStatus);
  }, [provider.id]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem("compare_providers");
      let list = stored ? JSON.parse(stored) : [];

      if (isCompared) {
        list = list.filter((item: any) => item.id !== provider.id);
      } else {
        if (list.length >= 4) {
          alert("You can compare up to 4 providers at a time.");
          return;
        }
        list.push({
          id: provider.id,
          name: provider.businessName,
          trustScore: provider.trustScore,
          avatarUrl: provider.avatarUrl,
        });
      }

      localStorage.setItem("compare_providers", JSON.stringify(list));
      setIsCompared(!isCompared);
      window.dispatchEvent(new Event("compare_updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const logContact = async (type: "CALL" | "WHATSAPP") => {
    try {
      await fetch(`/api/providers/${provider.id}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch {
      // Non-blocking
    }
  };

  const phone = provider.user?.phone || "+919837012345";
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello ${provider.businessName}, I found your profile on TrustLocal Dehradun and would like to inquire about your services.`
  )}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/60 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar: Provider type, Availability, and Compare toggle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ProviderTypeBadge type={provider.type} />
            <AvailabilityBadge status={provider.availability} />
          </div>

          <button
            type="button"
            onClick={toggleCompare}
            className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg transition border ${
              isCompared
                ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
            title="Add to compare list"
          >
            {isCompared ? <Check className="w-3 h-3 text-blue-600" /> : <Scale className="w-3 h-3" />}
            <span>{isCompared ? "Comparing" : "Compare"}</span>
          </button>
        </div>

        {/* Main Provider Row */}
        <div className="flex gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <Image
              src={
                provider.avatarUrl ||
                "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200"
              }
              alt={provider.businessName}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/provider/${provider.slug}`}
              className="block font-bold text-slate-900 group-hover:text-blue-600 transition text-base truncate"
            >
              {provider.businessName}
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {provider.locality ? `${provider.locality}, Dehradun` : "Dehradun"}
              </span>
              <span className="text-slate-300">·</span>
              <span className="shrink-0">{provider.experienceYears}+ yrs exp</span>
            </div>

            {/* Ratings and Completed Jobs */}
            <div className="flex items-center gap-3 mt-2">
              <RatingStars
                rating={provider.averageRating || 5.0}
                reviewsCount={provider.reviewCount || 1}
                size="sm"
              />
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{provider.completedJobsCount} jobs done</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trust Score & Verification badges */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <TrustScoreBadge score={provider.trustScore} size="sm" showLabel={true} />
          <VerificationBadges
            verifications={provider.verifications || []}
            maxDisplay={3}
            compact={true}
          />
        </div>

        {/* Specializations Tags */}
        {provider.specializations && provider.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {provider.specializations.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
              >
                {spec}
              </span>
            ))}
            {provider.specializations.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{provider.specializations.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Price info & CTAs */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-xs text-slate-500">
            {provider.pricing?.startingPrice ? (
              <>
                Starts from{" "}
                <span className="font-bold text-sm text-slate-900">
                  {formatPrice(provider.pricing.startingPrice)}
                </span>
              </>
            ) : provider.pricing?.visitCharge ? (
              <>
                Visit charge:{" "}
                <span className="font-bold text-sm text-slate-900">
                  {formatPrice(provider.pricing.visitCharge)}
                </span>
              </>
            ) : (
              <span className="font-medium text-slate-700">Custom Project Quote</span>
            )}
          </div>

          <div className="text-[11px] text-slate-400">Direct Contact</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${phone}`}
            onClick={() => logContact("CALL")}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition"
            title="Call Provider"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logContact("WHATSAPP")}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <Link
            href={`/provider/${provider.slug}`}
            className="flex items-center justify-center py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition shadow-sm"
          >
            <span>View Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
