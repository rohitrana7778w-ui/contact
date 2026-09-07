import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Role, ProviderType, AvailabilityStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      role = "CUSTOMER",
      // Provider-specific fields:
      providerType = "INDIVIDUAL",
      businessName,
      locality,
      serviceArea,
      experienceYears,
      description,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "PROVIDER") {
      if (!businessName) {
        return NextResponse.json({ error: "Business / Professional name is required for providers." }, { status: 400 });
      }

      // Generate unique slug
      let baseSlug = slugify(businessName);
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.provider.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          phone,
          hashedPassword,
          role: Role.PROVIDER,
          provider: {
            create: {
              type: (providerType as ProviderType) || ProviderType.INDIVIDUAL,
              businessName,
              slug,
              description: description || `Professional ${businessName} providing skilled services in Dehradun.`,
              city: "Dehradun",
              locality: locality || "Dehradun",
              serviceArea: serviceArea || "Dehradun (Within 10 km)",
              experienceYears: Number(experienceYears) || 1,
              availability: AvailabilityStatus.AVAILABLE,
              isApproved: false, // Requires admin approval
              trustScore: 25, // Initial starting score
            },
          },
        },
        include: {
          provider: true,
        },
      });

      return NextResponse.json({
        message: "Provider registered successfully. Profile submitted for admin verification.",
        user: { id: user.id, email: user.email, name: user.name, role: user.role, providerId: user.provider?.id },
      }, { status: 201 });
    } else {
      // Standard customer registration
      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          phone,
          hashedPassword,
          role: Role.CUSTOMER,
        },
      });

      return NextResponse.json({
        message: "Customer account created successfully.",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to register." }, { status: 500 });
  }
}
