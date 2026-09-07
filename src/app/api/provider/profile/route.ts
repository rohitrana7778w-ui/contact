import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recalculateTrustScore } from "@/lib/trust-score";
import { AvailabilityStatus, ProviderType } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
      include: {
        services: { include: { service: true } },
        verifications: true,
        portfolio: true,
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider profile not found." }, { status: 404 });
    }

    return NextResponse.json({ provider });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      type,
      description,
      locality,
      serviceArea,
      experienceYears,
      specializations,
      pricing,
      availability,
    } = body;

    const existing = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Provider profile not found." }, { status: 404 });
    }

    const updated = await prisma.provider.update({
      where: { id: existing.id },
      data: {
        businessName: businessName || existing.businessName,
        type: type ? (type as ProviderType) : existing.type,
        description: description !== undefined ? description : existing.description,
        locality: locality !== undefined ? locality : existing.locality,
        serviceArea: serviceArea || existing.serviceArea,
        experienceYears: experienceYears ? Number(experienceYears) : existing.experienceYears,
        specializations: Array.isArray(specializations) ? specializations : existing.specializations,
        pricing: pricing !== undefined ? pricing : (existing.pricing as any),
        availability: availability ? (availability as AvailabilityStatus) : existing.availability,
      },
    });

    // Update Trust Score dynamically
    await recalculateTrustScore(existing.id);

    return NextResponse.json({ success: true, provider: updated });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
