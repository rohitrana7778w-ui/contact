import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComplaintCategory, ComplaintStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in to submit an issue report." }, { status: 401 });
    }

    const body = await req.json();
    const { category, description, evidence = [] } = body;

    if (!category || !description || description.trim().length < 15) {
      return NextResponse.json(
        { error: "Please select a category and provide a detailed explanation (minimum 15 characters)." },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        reporterId: session.user.id,
        providerId: params.id,
        category: category as ComplaintCategory,
        description: description.trim(),
        evidence,
        status: ComplaintStatus.OPEN,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted. Our moderation team will investigate this within 24 hours.",
      complaintId: complaint.id,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Report error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
