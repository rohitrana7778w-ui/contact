import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateTrustScore } from "@/lib/trust-score";
import { ComplaintStatus } from "@prisma/client";

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
    const { status, resolution } = body;

    if (!status || !["RESOLVED", "REJECTED", "IN_REVIEW"].includes(status)) {
      return NextResponse.json({ error: "Invalid complaint status." }, { status: 400 });
    }

    const complaint = await prisma.complaint.update({
      where: { id: params.id },
      data: {
        status: status as ComplaintStatus,
        resolution: resolution || null,
        adminId: session.user.id,
        resolvedAt: status === "RESOLVED" || status === "REJECTED" ? new Date() : null,
      },
    });

    // Recalculate provider Trust Score (deductions will take effect!)
    await recalculateTrustScore(complaint.providerId);

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    console.error("Admin complaint update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
