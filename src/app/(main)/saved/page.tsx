import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProviderCard } from "@/components/provider-card";
import { Bookmark, Search } from "lucide-react";

export default async function SavedProvidersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/saved");
  }

  const savedRecords = await prisma.savedProvider.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        include: {
          user: { select: { name: true, phone: true } },
          services: { include: { service: true } },
          verifications: { where: { status: "APPROVED" } },
          _count: { select: { reviews: true, portfolio: true } },
        },
      },
    },
  });

  const providers = savedRecords.map((s) => s.provider);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Bookmark className="w-5 h-5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">My Shortlist</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Service Providers
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quick access to technicians, workshops, and contractors you bookmarked for upcoming projects.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition shadow-sm w-fit"
          >
            <Search className="w-4 h-4" />
            <span>Discover More Providers</span>
          </Link>
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No saved providers yet</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              When searching for skilled technicians or contractors, click the bookmark icon to save them to your personal shortlist.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
            >
              Start Searching in Dehradun
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
