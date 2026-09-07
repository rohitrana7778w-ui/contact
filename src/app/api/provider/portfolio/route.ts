import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateTrustScore } from "@/lib/trust-score";
import { VerificationStatus } from "@prisma/client";

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
    const {
      title,
      projectType,
      locality,
      year,
      approxArea,
      approxBudget,
      description,
      workPerformed,
      mediaUrls = [],
    } = body;

    if (!title || !projectType || !description) {
      return NextResponse.json(
        { error: "Title, project type, and description are required." },
        { status: 400 }
      );
    }

    const project = await prisma.portfolioProject.create({
      data: {
        providerId: provider.id,
        title,
        projectType,
        locality: locality || "Dehradun",
        year: year ? Number(year) : new Date().getFullYear(),
        approxArea: approxArea || null,
        approxBudget: approxBudget ? Number(approxBudget) : null,
        description,
        workPerformed: workPerformed || null,
        mediaUrls,
        verificationStatus: VerificationStatus.PENDING,
      },
    });

    // Recalculate score
    await recalculateTrustScore(provider.id);

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("Portfolio project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
