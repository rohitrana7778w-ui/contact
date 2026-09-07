"use client";

import React from "react";
import {
  Phone,
  ShieldCheck,
  MapPin,
  Briefcase,
  CheckCircle2,
  Users,
  Building,
} from "lucide-react";
import { VERIFICATION_TYPES } from "@/lib/constants";

export interface VerificationItem {
  type: keyof typeof VERIFICATION_TYPES;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

interface VerificationBadgesProps {
  verifications: VerificationItem[];
  maxDisplay?: number;
  compact?: boolean;
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

export function VerificationBadges({
  verifications = [],
  maxDisplay = 7,
  compact = false,
}: VerificationBadgesProps) {
  const approvedVerifications = verifications.filter((v) => v.status === "APPROVED");

  if (approvedVerifications.length === 0) {
    return (
      <span className="text-[11px] text-slate-400 italic">
        Pending initial verification
      </span>
    );
  }

  const displayed = approvedVerifications.slice(0, maxDisplay);
  const remainingCount = approvedVerifications.length - displayed.length;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {displayed.map((v) => {
          const config = VERIFICATION_TYPES[v.type];
          if (!config) return null;
          const IconComponent = ICONS[config.icon] || ShieldCheck;
          return (
            <span
              key={v.type}
              title={config.label}
              className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center cursor-help"
            >
              <IconComponent className="w-3 h-3" />
            </span>
          );
        })}
        {remainingCount > 0 && (
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1 rounded">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {displayed.map((v) => {
        const config = VERIFICATION_TYPES[v.type];
        if (!config) return null;
        const IconComponent = ICONS[config.icon] || ShieldCheck;
        return (
          <span
            key={v.type}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50/80 border border-blue-100 text-blue-700 text-[11px] font-medium"
            title={config.description}
          >
            <IconComponent className="w-3 h-3 text-blue-600" />
            <span>{config.label}</span>
          </span>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-xs font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
