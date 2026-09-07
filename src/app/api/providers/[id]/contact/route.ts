import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContactType } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const type = body.type as ContactType;

    if (!type || !["CALL", "WHATSAPP"].includes(type)) {
      return NextResponse.json({ error: "Invalid contact type" }, { status: 400 });
    }

    const event = await prisma.contactEvent.create({
      data: {
        providerId: params.id,
        customerId: session?.user?.id || null,
        type,
      },
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error: any) {
    console.error("Contact log error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
