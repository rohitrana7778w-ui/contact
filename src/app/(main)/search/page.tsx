import React from "react";
import Link from "next/link";
import { Search, Filter, MapPin, ShieldCheck, RefreshCcw, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProviderCard } from "@/components/provider-card";
import { PROVIDER_TYPES, AVAILABILITY_STATUS, TRUST_LEVELS } from "@/lib/constants";
import { ProviderType, AvailabilityStatus } from "@prisma/client";

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    type?: string;
    minTrust?: string;
    availability?: string;
    locality?: string;
    sort?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() || "";
  const categorySlug = searchParams.category || "";
  const type = searchParams.type as ProviderType | undefined;
  const minTrust = parseInt(searchParams.minTrust || "0", 10);
  const availability = searchParams.availability as AvailabilityStatus | undefined;
  const locality = searchParams.locality || "";
  const sort = searchParams.sort || "trust";

  // Build Prisma Where Clause
  const where: any = {
    isApproved: true,
    isActive: true,
  };

  if (q) {
    where.OR = [
      { businessName: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { specializations: { hasSome: [q] } },
      {
        services: {
          some: {
            service: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { keywords: { hasSome: [q.toLowerCase()] } },
              ],
            },
          },
        },
      },
    ];
  }

  if (categorySlug) {
    where.services = {
      some: {
        service: {
          category: {
            slug: categorySlug,
          },
        },
      },
    };
  }

  if (type) {
    where.type = type;
  }

  if (minTrust > 0) {
    where.trustScore = { gte: minTrust };
  }

  if (availability) {
    where.availability = availability;
  }

  if (locality) {
    where.locality = { contains: locality, mode: "insensitive" };
  }

  let orderBy: any = { trustScore: "desc" };
  if (sort === "experience") {
    orderBy = { experienceYears: "desc" };
  } else if (sort === "jobs") {
    orderBy = { completedJobsCount: "desc" };
  }

  let providers: any[] = [];
  let categories: any[] = [];

  try {
    providers = await prisma.provider.findMany({
      where,
      orderBy,
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
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("Search error:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8">
          <form method="GET" action="/search" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search problem, service or provider (e.g. AC cooling, wiring, Rawat Builders)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Dehradun</span>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Content Layout: Filters Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filters</span>
                </div>
                <Link
                  href="/search"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Reset</span>
                </Link>
              </div>

              {/* Provider Type Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Provider Type
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, type: "" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      !type ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Provider Types
                  </Link>
                  {Object.entries(PROVIDER_TYPES).map(([key, val]) => (
                    <Link
                      key={key}
                      href={`/search?${new URLSearchParams({ ...searchParams, type: key })}`}
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        type === key
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {val.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Score Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Minimum Trust Score
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, minTrust: "" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      minTrust === 0
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Any Trust Score
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, minTrust: "90" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      minTrust === 90
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ⭐ 90+ (Highly Trusted)
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, minTrust: "75" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      minTrust === 75
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🛡️ 75+ (Trusted)
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, minTrust: "60" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      minTrust === 60
                        ? "bg-amber-50 text-amber-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ✓ 60+ (Good)
                  </Link>
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Availability
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, availability: "" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      !availability
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Any Status
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, availability: "AVAILABLE" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      availability === "AVAILABLE"
                        ? "bg-green-50 text-green-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🟢 Available Now
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, availability: "ACCEPTING" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      availability === "ACCEPTING"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🔵 Accepting Projects
                  </Link>
                </div>
              </div>

              {/* Service Categories Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Category
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, category: "" })}`}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      !categorySlug
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/search?${new URLSearchParams({ ...searchParams, category: cat.slug })}`}
                      className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                        categorySlug === cat.slug
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Header with Result Count and Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {providers.length} {providers.length === 1 ? "Provider" : "Providers"} Found
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing verified skilled service providers in Dehradun
                  {q && ` for "${q}"`}
                </p>
              </div>

              {/* Sort Switcher */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, sort: "trust" })}`}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      sort === "trust" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Trust Score
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, sort: "jobs" })}`}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      sort === "jobs" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Jobs Done
                  </Link>
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, sort: "experience" })}`}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      sort === "experience" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Experience
                  </Link>
                </div>
              </div>
            </div>

            {/* Providers Grid */}
            {providers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No providers match your exact filters
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try broadening your search term, clearing some filters, or looking for general categories like &quot;AC repair&quot; or &quot;Electrician&quot;.
                </p>
                <div>
                  <Link
                    href="/search"
                    className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs transition"
                  >
                    Clear All Filters
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
