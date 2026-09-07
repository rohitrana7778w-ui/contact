import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProviderVerificationClient } from "@/components/provider-verification-client";

export default async function ProviderVerificationPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: { userId: session.user.id },
    include: {
      verifications: true,
    },
  });

  if (!provider) {
    redirect("/dashboard/provider");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Trust & Verification Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Each approved verification badge increases your profile Trust Score and builds confidence with Dehradun customers.
        </p>
      </div>

      <ProviderVerificationClient
        providerId={provider.id}
        verifications={provider.verifications as any}
      />
    </div>
  );
}
