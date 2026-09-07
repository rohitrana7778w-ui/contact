import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProviderPortfolioClient } from "@/components/provider-portfolio-client";

export default async function ProviderPortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: { userId: session.user.id },
    include: {
      portfolio: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!provider) {
    redirect("/dashboard/provider");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Portfolio & Project Evidence
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload completed jobs to increase your Trust Score (+15 points for 3+ projects). Evidence of real work beats reviews!
        </p>
      </div>

      <ProviderPortfolioClient
        providerId={provider.id}
        projects={provider.portfolio as any}
      />
    </div>
  );
}
