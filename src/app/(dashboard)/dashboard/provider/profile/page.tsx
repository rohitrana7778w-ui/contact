import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProviderProfileForm } from "@/components/provider-profile-form";

export default async function ProviderProfileSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: { userId: session.user.id },
  });

  if (!provider) {
    redirect("/dashboard/provider");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profile & Pricing Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep your service rates, coverage areas, and business details up to date for Dehradun customers.
        </p>
      </div>

      <ProviderProfileForm provider={provider as any} />
    </div>
  );
}
