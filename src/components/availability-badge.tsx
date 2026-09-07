"use client";

import React from "react";
import { AVAILABILITY_STATUS } from "@/lib/constants";

interface AvailabilityBadgeProps {
  status: keyof typeof AVAILABILITY_STATUS;
  showDotOnly?: boolean;
}

export function AvailabilityBadge({
  status,
  showDotOnly = false,
}: AvailabilityBadgeProps) {
  const config = AVAILABILITY_STATUS[status] || AVAILABILITY_STATUS.AVAILABLE;

  if (showDotOnly) {
    return (
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${config.color} ring-2 ring-white`}
        title={config.label}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${config.textClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.color} animate-pulse`} />
      <span>{config.label}</span>
    </span>
  );
}
