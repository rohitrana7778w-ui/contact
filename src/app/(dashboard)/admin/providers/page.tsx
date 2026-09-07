import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, ArrowUpRight } from "lucide-react";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { ProviderTypeBadge } from "@/components/provider-type-badge";
import { AdminActionButtons } from "@/components/admin-action-buttons";

export default async function AdminProvidersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const providers = await prisma.provider.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      _count: { select: { reviews: true, portfolio: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All Service Providers ({providers.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage provider approvals, monitor Trust Scores, and handle suspensions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Business & Contact</th>
              <th className="p-4">Type</th>
              <th className="p-4">Trust Score</th>
              <th className="p-4">Activity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {providers.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="p-4 space-y-0.5">
                  <Link
                    href={`/provider/${p.slug}`}
                    target="_blank"
                    className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 text-sm"
                  >
                    <span>{p.businessName}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </Link>
                  <div className="text-slate-500">
                    {p.user.name} · {p.user.phone || p.user.email}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{p.locality || "Dehradun"}</span>
                  </div>
                </td>

                <td className="p-4">
                  <ProviderTypeBadge type={p.type} />
                </td>

                <td className="p-4">
                  <TrustScoreBadge score={p.trustScore} size="sm" showLabel={true} />
                </td>

                <td className="p-4 text-slate-600">
                  <div>{p.completedJobsCount} jobs completed</div>
                  <div className="text-[11px] text-slate-400">
                    {p._count.portfolio} projects · {p._count.reviews} reviews
                  </div>
                </td>

                <td className="p-4">
                  {!p.isApproved ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                      Pending Approval
                    </span>
                  ) : !p.isActive ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px]">
                      Suspended
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      Active & Live
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  <AdminActionButtons
                    providerId={p.id}
                    isApproved={p.isApproved}
                    isActive={p.isActive}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
