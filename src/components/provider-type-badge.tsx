"use client";

import React from "react";
import { User, Store, Building2, HardHat } from "lucide-react";
import { PROVIDER_TYPES } from "@/lib/constants";

interface ProviderTypeBadgeProps {
  type: keyof typeof PROVIDER_TYPES;
}

const TYPE_ICONS = {
  INDIVIDUAL: User,
  SHOP: Store,
  COMPANY: Building2,
  CONTRACTOR: HardHat,
};

export function ProviderTypeBadge({ type }: ProviderTypeBadgeProps) {
  const config = PROVIDER_TYPES[type] || PROVIDER_TYPES.INDIVIDUAL;
  const Icon = TYPE_ICONS[type] || User;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${config.badgeClass}`}
      title={config.description}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
