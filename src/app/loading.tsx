import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin stroke-2" />
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Loading TrustLocal...
        </span>
      </div>
    </div>
  );
}
