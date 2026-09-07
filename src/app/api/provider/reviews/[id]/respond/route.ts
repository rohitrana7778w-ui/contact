import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { response } = body;

    if (!response || response.trim().length < 5) {
      return NextResponse.json({ error: "Response cannot be empty." }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review || review.providerId !== provider.id) {
      return NextResponse.json({ error: "Review not found or unauthorized." }, { status: 403 });
    }

    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        providerResponse: response.trim(),
        providerRespondedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    console.error("Review response error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
