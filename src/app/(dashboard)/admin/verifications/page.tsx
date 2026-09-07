import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileCheck, ShieldCheck } from "lucide-react";
import { VERIFICATION_TYPES } from "@/lib/constants";
import { AdminVerificationActions } from "@/components/admin-verification-actions";
import { formatDate } from "@/lib/utils";

export default async function AdminVerificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const verifications = await prisma.verification.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          locality: true,
          trustScore: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verification Review Queue ({verifications.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review evidence submitted by technicians and contractors. Approving a badge immediately increases their Trust Score.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Provider</th>
              <th className="p-4">Badge Type</th>
              <th className="p-4">Evidence / Reference Submitted</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {verifications.map((v) => {
              const config = VERIFICATION_TYPES[v.type as keyof typeof VERIFICATION_TYPES];

              return (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <Link
                      href={`/provider/${v.provider.slug}`}
                      target="_blank"
                      className="font-bold text-slate-900 hover:text-blue-600 block text-sm"
                    >
                      {v.provider.businessName}
                    </Link>
                    <span className="text-[11px] text-slate-500">
                      Score: {v.provider.trustScore} · {v.provider.locality || "Dehradun"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{config?.label || v.type}</span>
                    </span>
                  </td>

                  <td className="p-4 max-w-sm text-slate-700">
                    <div className="font-mono text-xs bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                      {v.evidence || "No text evidence"}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Submitted on {formatDate(v.createdAt)}
                    </span>
                  </td>

                  <td className="p-4">
                    {v.status === "APPROVED" && (
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        Approved
                      </span>
                    )}
                    {v.status === "PENDING" && (
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                        Pending Review
                      </span>
                    )}
                    {v.status === "REJECTED" && (
                      <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px]">
                        Rejected
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {v.status === "PENDING" ? (
                      <AdminVerificationActions verificationId={v.id} />
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">Decided</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
