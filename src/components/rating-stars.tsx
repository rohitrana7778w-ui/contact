"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number; // 0 to 5
  reviewsCount?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function RatingStars({
  rating,
  reviewsCount,
  size = "sm",
  showValue = true,
}: RatingStarsProps) {
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-bold",
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 fill-slate-100"
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className={`font-semibold text-slate-900 ${textSizes[size]}`}>
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-500">({reviewsCount})</span>
      )}
    </div>
  );
}
