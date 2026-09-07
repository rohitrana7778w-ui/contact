import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateTrustScore } from "@/lib/trust-score";
import { VerificationStatus } from "@prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status, notes } = body; // "APPROVED" | "REJECTED"

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid verification status." }, { status: 400 });
    }

    const verification = await prisma.verification.update({
      where: { id: params.id },
      data: {
        status: status as VerificationStatus,
        notes: notes || null,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    // Recalculate provider Trust Score
    await recalculateTrustScore(verification.providerId);

    return NextResponse.json({ success: true, verification });
  } catch (error: any) {
    console.error("Admin verification update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
