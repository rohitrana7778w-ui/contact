import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AlertCircle, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function CustomerComplaintsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/complaints");
  }

  const complaints = await prisma.complaint.findMany({
    where: { reporterId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: {
          businessName: true,
          slug: true,
          locality: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Safety & Moderation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Dispute & Complaint Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track investigations regarding misrepresentation, poor trade conduct, or service discrepancies.
          </p>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No active complaints filed</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven&apos;t reported any service providers. Our platform continuously audits provider credentials and customer feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/provider/${c.provider.slug}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600"
                      >
                        {c.provider.businessName}
                      </Link>
                      <span className="text-xs text-slate-400">· {c.provider.locality || "Dehradun"}</span>
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[11px]">
                      {c.category.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div>
                    {c.status === "OPEN" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200/60">
                        <Clock className="w-3 h-3" />
                        <span>Under Investigation</span>
                      </span>
                    )}
                    {c.status === "RESOLVED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved & Penalized</span>
                      </span>
                    )}
                    {c.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                        <span>Dismissed</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100">
                  <p className="italic">&quot;{c.description}&quot;</p>
                  <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">
                    Reported on {formatDate(c.createdAt)}
                  </span>
                </div>

                {c.resolution && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
                    <strong className="font-semibold block mb-0.5">Admin Findings & Resolution:</strong>
                    <p>{c.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
