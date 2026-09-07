import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  Layers,
  FileCheck,
  Star,
  BarChart3,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Users,
  AlertTriangle,
  FolderTree,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";
  const isProvider = session.user.role === "PROVIDER";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>
              Trust<span className="text-blue-400">Local</span>
            </span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            {isAdmin ? "Admin" : "Pro"}
          </span>
        </div>

        {/* User Info Tile */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="text-xs font-semibold text-white truncate">{session.user.name}</div>
          <div className="text-[11px] text-slate-400 truncate">{session.user.email}</div>
          <div className="mt-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            {session.user.role} PORTAL
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1 flex-1 text-xs font-medium">
          {/* PROVIDER LINKS */}
          {isProvider && (
            <>
              <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                My Business
              </div>
              <Link
                href="/dashboard/provider"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Overview & Inquiries</span>
              </Link>
              <Link
                href="/dashboard/provider/profile"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <User className="w-4 h-4 text-blue-400" />
                <span>Profile & Pricing</span>
              </Link>
              <Link
                href="/dashboard/provider/portfolio"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Portfolio & Projects</span>
              </Link>
              <Link
                href="/dashboard/provider/verification"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Verifications & Trust</span>
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Administration
              </div>
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Admin Overview</span>
              </Link>
              <Link
                href="/admin/providers"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Provider Approvals</span>
              </Link>
              <Link
                href="/admin/verifications"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span>Verification Requests</span>
              </Link>
              <Link
                href="/admin/complaints"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                <span>Complaints & Disputes</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <FolderTree className="w-4 h-4 text-purple-400" />
                <span>Categories & Services</span>
              </Link>
            </>
          )}
        </nav>

        {/* Back to Public Site */}
        <div className="p-3 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
