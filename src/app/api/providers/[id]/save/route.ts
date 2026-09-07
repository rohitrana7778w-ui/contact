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
      return NextResponse.json({ error: "Authentication required to save providers." }, { status: 401 });
    }

    const saved = await prisma.savedProvider.upsert({
      where: {
        customerId_providerId: {
          customerId: session.user.id,
          providerId: params.id,
        },
      },
      update: {},
      create: {
        customerId: session.user.id,
        providerId: params.id,
      },
    });

    return NextResponse.json({ success: true, saved: true });
  } catch (error: any) {
    console.error("Save provider error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    await prisma.savedProvider.deleteMany({
      where: {
        customerId: session.user.id,
        providerId: params.id,
      },
    });

    return NextResponse.json({ success: true, saved: false });
  } catch (error: any) {
    console.error("Unsave provider error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
