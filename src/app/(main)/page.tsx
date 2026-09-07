import React from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Scale,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Zap,
  Wrench,
  Cpu,
  Car,
  HardHat,
  Home,
  Star,
  Users,
  Building,
  Store,
  User,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProviderCard } from "@/components/provider-card";
import { TrustScoreBadge } from "@/components/trust-score-badge";

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  // Fetch featured / approved providers
  let featuredProviders: any[] = [];
  let categories: any[] = [];

  try {
    featuredProviders = await prisma.provider.findMany({
      where: { isApproved: true, isActive: true },
      take: 6,
      orderBy: { trustScore: "desc" },
      include: {
        verifications: {
          select: { type: true, status: true },
        },
        user: {
          select: { phone: true },
        },
      },
    });

    categories = await prisma.category.findMany({
      take: 8,
      include: {
        _count: {
          select: { services: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Database fetch error on homepage:", error);
  }

  const categoryIcons: Record<string, any> = {
    Home: Home,
    Cpu: Cpu,
    Car: Car,
    HardHat: HardHat,
    Wrench: Wrench,
    Zap: Zap,
  };

  const popularQueries = [
    { label: "AC Not Cooling", query: "ac not cooling" },
    { label: "Electrician", query: "electrician" },
    { label: "Water Leakage", query: "water leakage" },
    { label: "House Contractor", query: "house contractor" },
    { label: "Laptop Repair", query: "laptop repair" },
    { label: "Car Mechanic", query: "car mechanic" },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Location / Pilot Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-semibold text-blue-800 mb-6">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Serving Dehradun & Surrounding Valley</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find Local Skilled Professionals{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              You Can Actually Trust
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop relying on blind recommendations. Search by your exact problem, inspect verified past work, compare Trust Scores, and connect directly on WhatsApp or Call.
          </p>

          {/* Search Box */}
          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <form
              action="/search"
              method="GET"
              className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-950/5 border border-slate-200/90 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Describe your problem or service (e.g. AC gas leak, wiring, house contractor)..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 border-l border-slate-200 text-xs text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Dehradun</span>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <span>Find Providers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick problem chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Popular searches:</span>
              {popularQueries.map((item) => (
                <Link
                  key={item.label}
                  href={`/search?q=${encodeURIComponent(item.query)}`}
                  className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white border border-slate-200 text-slate-700 font-medium transition hover:border-blue-300 hover:text-blue-600 shadow-2xs"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PILLARS (FIND. VERIFY. COMPARE. CONNECT.) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            The TrustLocal Difference
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            More Than Just Another Directory
          </p>
          <p className="text-sm text-slate-500 mt-2">
            A standard directory only answers &quot;who is nearby?&quot; We answer &quot;who is qualified, proven, and reasonably priced for my specific job?&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">1. Unified Search</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search by problem or trade. Independent technicians, local shops, companies, and contractors appear together in one transparent list.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">2. Evidence Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect completed job photos, genuine customer reviews, trade licenses, and our objective 0–100 Trust Score that cannot be bought.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">3. Side-by-Side Compare</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select 2 to 4 shortlisted providers to evaluate their rates, years in service, completed projects, and real availability side by side.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">4. Direct Connection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Call or WhatsApp the technician directly. No middlemen, no forced commission cuts, and no mandatory app payment holds.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
              Browse Categories
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              Skilled Trades in Dehradun
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.icon || ""] || Wrench;
            return (
              <Link
                key={cat.id}
                href={`/search?category=${encodeURIComponent(cat.slug)}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-blue-600">
                    {cat._count.services} service types →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED / HIGHLY TRUSTED PROVIDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
              Verified & Vetted
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              Top Rated Professionals in Dehradun
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      {/* 5. HOW TRUST SCORE WORKS (CORE DIFFERENTIATOR) */}
      <section id="how-trust-works" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent & Non-Purchasable</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              How the Trust Score Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              Paid visibility must NEVER equal paid trust. Providers cannot pay to boost their Trust Score. The 0–100 score is computed purely from verified evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="text-emerald-400 font-bold text-lg">Identity & Trade Check</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Govt ID, business registration, physical shop/address inspection, and certified technical diplomas verified by human platform admins.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
                Weights: ID (10 pts) + Phone (5 pts) + Location (5 pts) + Trade Exp (10 pts)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="text-blue-400 font-bold text-lg">Evidence of Real Work</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before-and-after photos, on-site completion records, and direct customer reference calls confirming project execution and quality.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
                Weights: Portfolio (15 pts) + Completed Jobs (10 pts) + Client Refs (10 pts)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="text-amber-400 font-bold text-lg">Review Authenticity & Safety</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Multi-factor reviews (Quality, Punctuality, Pricing Fairness, Behavior) with automated anti-spam moderation and strict dispute deductions.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
                Weights: Verified Reviews (15 pts) + Rating (10 pts) − Complaints Deductions
              </div>
            </div>
          </div>

          {/* Trust Level Scale */}
          <div className="mt-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 max-w-4xl mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
              Trust Score Tiers
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                <span className="font-extrabold text-emerald-400 block text-sm">90 – 100</span>
                <span className="text-[11px] text-emerald-200">Highly Trusted</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30">
                <span className="font-extrabold text-blue-400 block text-sm">75 – 89</span>
                <span className="text-[11px] text-blue-200">Trusted</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30">
                <span className="font-extrabold text-amber-400 block text-sm">60 – 74</span>
                <span className="text-[11px] text-amber-200">Good</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-700/60 border border-slate-600/30">
                <span className="font-extrabold text-slate-300 block text-sm">40 – 59</span>
                <span className="text-[11px] text-slate-400">Limited History</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <span className="font-extrabold text-slate-400 block text-sm">0 – 39</span>
                <span className="text-[11px] text-slate-400">New Provider</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOR PROFESSIONALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-600/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Are You a Skilled Professional or Contractor in Dehradun?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Build a verified digital identity even without an expensive website or company registration. Showcase your real work, earn an objective Trust Score, and receive direct inquiries directly to your phone.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/register"
              className="py-3 px-6 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm text-center transition shadow-md"
            >
              List Your Services Free
            </Link>
            <Link
              href="/login"
              className="py-3 px-6 rounded-xl bg-blue-500/40 hover:bg-blue-500/60 border border-white/20 text-white font-semibold text-sm text-center transition"
            >
              Provider Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
