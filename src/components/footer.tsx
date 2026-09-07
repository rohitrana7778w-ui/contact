import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Heart, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>
                Trust<span className="text-blue-500">Local</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The trusted digital discovery and professional identity layer for local skilled services. Find, verify, compare, and connect directly.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Starting with Dehradun Valley</span>
            </div>
          </div>

          {/* Col 2: High Demand Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/search?q=ac+repair" className="hover:text-white transition">
                  AC Repair & Servicing
                </Link>
              </li>
              <li>
                <Link href="/search?q=electrician" className="hover:text-white transition">
                  Certified Electricians
                </Link>
              </li>
              <li>
                <Link href="/search?q=plumber" className="hover:text-white transition">
                  Plumbing & Leak Repairs
                </Link>
              </li>
              <li>
                <Link href="/search?q=laptop+repair" className="hover:text-white transition">
                  Laptop & Apple Care
                </Link>
              </li>
              <li>
                <Link href="/search?q=house+contractor" className="hover:text-white transition">
                  House Construction Contractors
                </Link>
              </li>
              <li>
                <Link href="/search?q=car+mechanic" className="hover:text-white transition">
                  Car Breakdown & Mechanics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Trust Principles */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Trust Principles
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Evidence before claims</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Trust Score cannot be purchased</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Direct phone & WhatsApp contact</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>No forced platform booking fees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Transparent dispute resolution</span>
              </li>
            </ul>
          </div>

          {/* Col 4: For Providers & Platform */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Join the Network
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Are you an independent technician, shop owner, contractor, or service company in Dehradun?
            </p>
            <Link
              href="/register"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              List Your Services Free
            </Link>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 text-xs">
              <Link href="/login" className="hover:text-white">Sign In</Link>
              <span className="text-slate-700">·</span>
              <Link href="/compare" className="hover:text-white">Compare Tool</Link>
              <span className="text-slate-700">·</span>
              <Link href="/admin" className="hover:text-white">Admin</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TrustLocal Platform. Built with transparency for Dehradun.</p>
          <div className="flex items-center gap-1">
            <span>Empowering local independent workers & businesses</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
