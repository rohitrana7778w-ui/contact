import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Layers, Plus, Tag } from "lucide-react";

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      services: {
        include: {
          _count: {
            select: { providers: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Service Catalog & Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain discovery taxonomy, service definitions, and provider specializations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {cat.services.length} services
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Active Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.services.map((svc) => (
                    <div
                      key={svc.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-700"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span className="font-medium">{svc.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-200/70 px-1 rounded">
                        {svc._count.providers}
                      </span>
                    </div>
                  ))}
                  {cat.services.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No sub-services configured yet.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Display sort order: #{cat.sortOrder}</span>
              <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                Manage Services
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
