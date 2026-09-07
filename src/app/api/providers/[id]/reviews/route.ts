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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in to submit a review." }, { status: 401 });
    }

    const body = await req.json();
    const {
      overallRating,
      qualityRating,
      behaviorRating,
      pricingRating,
      timelinessRating,
      communicationRating,
      text,
      serviceId,
    } = body;

    if (!overallRating || !text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Overall rating and detailed feedback (at least 10 chars) are required." },
        { status: 400 }
      );
    }

    // Check if user already reviewed this provider
    const existing = await prisma.review.findFirst({
      where: {
        providerId: params.id,
        customerId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this provider." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        customerId: session.user.id,
        providerId: params.id,
        serviceId: serviceId || null,
        overallRating: Number(overallRating),
        qualityRating: qualityRating ? Number(qualityRating) : null,
        behaviorRating: behaviorRating ? Number(behaviorRating) : null,
        pricingRating: pricingRating ? Number(pricingRating) : null,
        timelinessRating: timelinessRating ? Number(timelinessRating) : null,
        communicationRating: communicationRating ? Number(communicationRating) : null,
        text: text.trim(),
        isVerified: true, // In MVP, mark authenticated user review as verified
      },
    });

    // Recalculate provider Trust Score
    try {
      await recalculateTrustScore(params.id);
    } catch (e) {
      console.error("Trust score recalculation error:", e);
    }

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
