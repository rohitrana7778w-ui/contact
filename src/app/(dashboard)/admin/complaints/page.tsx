import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { AdminComplaintActions } from "@/components/admin-complaint-actions";
import { formatDate } from "@/lib/utils";

export default async function AdminComplaintsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          trustScore: true,
        },
      },
      reporter: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Safety & Complaints Moderation ({complaints.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Investigate customer reports. Valid complaints automatically deduct points from the provider&apos;s Trust Score.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Reported Provider</th>
              <th className="p-4">Category</th>
              <th className="p-4">Customer Complaint Description</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="p-4">
                  <Link
                    href={`/provider/${c.provider.slug}`}
                    target="_blank"
                    className="font-bold text-slate-900 hover:text-blue-600 block text-sm"
                  >
                    {c.provider.businessName}
                  </Link>
                  <span className="text-[11px] text-slate-500">
                    Trust Score: {c.provider.trustScore}
                  </span>
                </td>

                <td className="p-4">
                  <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[11px]">
                    {c.category}
                  </span>
                </td>

                <td className="p-4 max-w-sm text-slate-700">
                  <p className="italic text-xs">&quot;{c.description}&quot;</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Filed by {c.reporter.name} ({c.reporter.email}) on {formatDate(c.createdAt)}
                  </span>
                  {c.resolution && (
                    <div className="mt-1.5 p-1.5 rounded bg-slate-100 text-[11px] text-slate-700">
                      <strong>Resolution:</strong> {c.resolution}
                    </div>
                  )}
                </td>

                <td className="p-4">
                  {c.status === "OPEN" && (
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                      Open
                    </span>
                  )}
                  {c.status === "RESOLVED" && (
                    <span className="inline-block px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold text-[10px]">
                      Penalized
                    </span>
                  )}
                  {c.status === "REJECTED" && (
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      Dismissed
                    </span>
                  )}
                </td>

                <td className="p-4 text-right">
                  {c.status === "OPEN" ? (
                    <AdminComplaintActions complaintId={c.id} />
                  ) : (
                    <span className="text-slate-400 text-xs font-medium">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
