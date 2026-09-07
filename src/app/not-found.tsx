import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center border border-slate-200 shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-3xl font-extrabold tracking-tighter">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Page or Service Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The profile, trade category, or page you are looking for has either moved, been deactivated, or does not exist.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition"
          >
            <Search className="w-4 h-4" />
            <span>Explore Dehradun Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
