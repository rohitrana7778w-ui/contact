import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificationType, VerificationStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const body = await req.json();
    const { type, evidence, docUrl } = body;

    if (!type || !evidence) {
      return NextResponse.json({ error: "Verification type and evidence details required." }, { status: 400 });
    }

    const verification = await prisma.verification.upsert({
      where: {
        providerId_type: {
          providerId: provider.id,
          type: type as VerificationType,
        },
      },
      update: {
        evidence,
        docUrl: docUrl || null,
        status: VerificationStatus.PENDING,
      },
      create: {
        providerId: provider.id,
        type: type as VerificationType,
        evidence,
        docUrl: docUrl || null,
        status: VerificationStatus.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verification submitted for admin review.",
      verification,
    });
  } catch (error: any) {
    console.error("Verification submit error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
