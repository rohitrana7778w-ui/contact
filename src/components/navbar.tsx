"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShieldCheck,
  Search,
  MapPin,
  Menu,
  X,
  User,
  LogOut,
  Bookmark,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>
                Trust<span className="text-blue-600">Local</span>
              </span>
            </Link>

            {/* City Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Dehradun</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full ml-1">
                Pilot City
              </span>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="hidden lg:block flex-1 max-w-md">
            <Link
              href="/search"
              className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200 text-sm text-slate-500 transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search problem or service (e.g. AC not cooling, electrician)...</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/search" className="hover:text-blue-600 transition">
              Find Services
            </Link>
            <Link href="/compare" className="hover:text-blue-600 transition">
              Compare
            </Link>
            <Link href="/#how-trust-works" className="hover:text-blue-600 transition">
              Trust Score System
            </Link>
          </nav>

          {/* User / CTA actions */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition text-sm font-medium text-slate-800"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[120px] truncate">{session.user?.name || "My Account"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{session.user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{session.user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {session.user?.role}
                      </span>
                    </div>

                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {session.user?.role === "PROVIDER" && (
                      <Link
                        href="/dashboard/provider"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Provider Dashboard</span>
                      </Link>
                    )}

                    <Link
                      href="/saved"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>Saved Providers</span>
                    </Link>

                    <Link
                      href="/reviews"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Reviews</span>
                    </Link>

                    <Link
                      href="/complaints"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldAlert className="w-4 h-4 text-slate-400" />
                      <span>My Reports</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-500/20"
                >
                  Join / List Business
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-slate-100 text-sm text-slate-600"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search problems & services...</span>
          </Link>

          <nav className="flex flex-col space-y-2 pt-2 text-sm font-medium">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-800 hover:text-blue-600"
            >
              Find All Services
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-800 hover:text-blue-600"
            >
              Compare Providers
            </Link>
            <Link
              href="/#how-trust-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-slate-800 hover:text-blue-600"
            >
              How Trust Score Works
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {session ? (
              <>
                <div className="py-2 text-xs text-slate-500">
                  Signed in as <span className="font-semibold text-slate-800">{session.user?.name}</span> (
                  {session.user?.role})
                </div>

                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-3 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs"
                  >
                    🛡️ Admin Dashboard
                  </Link>
                )}

                {session.user?.role === "PROVIDER" && (
                  <Link
                    href="/dashboard/provider"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-3 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs"
                  >
                    🔧 Provider Dashboard
                  </Link>
                )}

                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm text-slate-700"
                >
                  Saved Providers
                </Link>

                <Link
                  href="/reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm text-slate-700"
                >
                  My Reviews
                </Link>

                <Link
                  href="/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-sm text-slate-700"
                >
                  My Dispute Reports
                </Link>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="py-2 text-sm text-red-600 text-left font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-center text-sm font-semibold text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
