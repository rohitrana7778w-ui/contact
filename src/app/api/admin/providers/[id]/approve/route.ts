import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateTrustScore } from "@/lib/trust-score";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body; // "APPROVE" | "REJECT" | "SUSPEND" | "ACTIVATE"

    let isApproved = true;
    let isActive = true;

    if (action === "REJECT") {
      isApproved = false;
      isActive = false;
    } else if (action === "SUSPEND") {
      isActive = false;
    } else if (action === "ACTIVATE") {
      isActive = true;
      isApproved = true;
    }

    const updated = await prisma.provider.update({
      where: { id: params.id },
      data: {
        isApproved,
        isActive,
      },
    });

    await recalculateTrustScore(params.id);

    return NextResponse.json({ success: true, provider: updated });
  } catch (error: any) {
    console.error("Admin approve error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
