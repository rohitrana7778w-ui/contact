import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProviderType, AvailabilityStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") as ProviderType | null;
    const minTrust = parseInt(searchParams.get("minTrust") || "0", 10);
    const availability = searchParams.get("availability") as AvailabilityStatus | null;
    const locality = searchParams.get("locality") || "";
    const sort = searchParams.get("sort") || "trust";

    const where: any = {
      isApproved: true,
      isActive: true,
    };

    if (q) {
      where.OR = [
        { businessName: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { specializations: { hasSome: [q] } },
        {
          services: {
            some: {
              service: {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { keywords: { hasSome: [q.toLowerCase()] } },
                ],
              },
            },
          },
        },
      ];
    }

    if (category) {
      where.services = {
        some: {
          service: {
            category: {
              slug: category,
            },
          },
        },
      };
    }

    if (type) {
      where.type = type;
    }

    if (minTrust > 0) {
      where.trustScore = { gte: minTrust };
    }

    if (availability) {
      where.availability = availability;
    }

    if (locality) {
      where.locality = { contains: locality, mode: "insensitive" };
    }

    // Sorting
    let orderBy: any = { trustScore: "desc" };
    if (sort === "experience") {
      orderBy = { experienceYears: "desc" };
    } else if (sort === "jobs") {
      orderBy = { completedJobsCount: "desc" };
    }

    const providers = await prisma.provider.findMany({
      where,
      orderBy,
      include: {
        verifications: {
          select: { type: true, status: true },
        },
        user: {
          select: { phone: true },
        },
      },
    });

    return NextResponse.json({ providers, total: providers.length });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
