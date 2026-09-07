import { prisma } from "@/lib/prisma";

export interface TrustScoreBreakdown {
  profileCompleteness: number; // max 10
  identityVerification: number; // max 10
  phoneVerification: number; // max 5
  locationVerification: number; // max 5
  experienceEvidence: number; // max 10
  completedWorkCount: number; // max 10
  portfolioQuality: number; // max 15
  verifiedReviews: number; // max 15
  reviewReliability: number; // max 10
  complaintsDeductions: number; // deductions (e.g. -5, -10)
  totalScore: number; // 0 - 100
}

export async function calculateTrustScore(providerId: string): Promise<TrustScoreBreakdown> {
  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    include: {
      verifications: true,
      portfolio: true,
      reviews: true,
      complaints: true,
    },
  });

  if (!provider) {
    throw new Error(`Provider not found: ${providerId}`);
  }

  // 1. Profile Completeness (max 10)
  let profileScore = 0;
  if (provider.businessName) profileScore += 2;
  if (provider.description && provider.description.length > 50) profileScore += 2;
  if (provider.avatarUrl) profileScore += 2;
  if (provider.locality && provider.serviceArea) profileScore += 2;
  if (provider.pricing) profileScore += 2;

  // 2. Identity Verification (max 10)
  const idVerified = provider.verifications.some(
    (v) => (v.type === "IDENTITY" || v.type === "BUSINESS") && v.status === "APPROVED"
  );
  const identityScore = idVerified ? 10 : 0;

  // 3. Phone Verification (max 5)
  const phoneVerified = provider.verifications.some(
    (v) => v.type === "PHONE" && v.status === "APPROVED"
  );
  const phoneScore = phoneVerified ? 5 : 0;

  // 4. Location Verification (max 5)
  const locVerified = provider.verifications.some(
    (v) => v.type === "LOCATION" && v.status === "APPROVED"
  );
  const locationScore = locVerified ? 5 : 0;

  // 5. Experience Evidence (max 10)
  const expVerified = provider.verifications.some(
    (v) => v.type === "EXPERIENCE" && v.status === "APPROVED"
  );
  let experienceScore = 0;
  if (expVerified) {
    experienceScore = 10;
  } else {
    // Unverified experience earns up to 5 points based on years
    experienceScore = Math.min(Math.floor(provider.experienceYears / 2), 5);
  }

  // 6. Completed Work Count (max 10)
  // 100+ jobs = 10, 50 jobs = 7, 20 jobs = 5, 5 jobs = 2
  let completedWorkScore = 0;
  if (provider.completedJobsCount >= 100) completedWorkScore = 10;
  else if (provider.completedJobsCount >= 50) completedWorkScore = 8;
  else if (provider.completedJobsCount >= 20) completedWorkScore = 5;
  else if (provider.completedJobsCount >= 5) completedWorkScore = 3;
  else if (provider.completedJobsCount > 0) completedWorkScore = 1;

  // 7. Portfolio Quality (max 15)
  // Verified projects with media photos
  const verifiedProjects = provider.portfolio.filter((p) => p.verificationStatus === "APPROVED" || p.verificationStatus === "VERIFIED");
  let portfolioScore = 0;
  if (verifiedProjects.length >= 3) portfolioScore = 15;
  else if (verifiedProjects.length >= 1) portfolioScore = 10;
  else if (provider.portfolio.length >= 2) portfolioScore = 6;
  else if (provider.portfolio.length >= 1) portfolioScore = 3;

  // 8. Verified Reviews Count (max 15)
  const verifiedReviews = provider.reviews.filter((r) => r.isVerified);
  let reviewsScore = 0;
  if (verifiedReviews.length >= 10) reviewsScore = 15;
  else if (verifiedReviews.length >= 5) reviewsScore = 12;
  else if (verifiedReviews.length >= 2) reviewsScore = 8;
  else if (verifiedReviews.length >= 1) reviewsScore = 4;

  // 9. Review Reliability & Average Rating (max 10)
  let ratingScore = 0;
  if (provider.reviews.length > 0) {
    const avgRating =
      provider.reviews.reduce((sum, r) => sum + r.overallRating, 0) / provider.reviews.length;
    // 5.0 rating = 10, 4.0 rating = 8, 3.0 rating = 5
    ratingScore = Math.round((avgRating / 5) * 10);
  }

  // 10. Complaints & Disputes Deductions
  const activeComplaints = provider.complaints.filter(
    (c) => c.status === "OPEN" || c.status === "IN_REVIEW" || c.status === "RESOLVED"
  );
  let complaintDeductions = 0;
  for (const comp of activeComplaints) {
    if (comp.status === "RESOLVED" && comp.resolution?.includes("Valid complaint")) {
      complaintDeductions += 15;
    } else if (comp.status === "IN_REVIEW") {
      complaintDeductions += 5;
    }
  }

  // Sum everything up (bounded 0 to 100)
  const rawTotal =
    profileScore +
    identityScore +
    phoneScore +
    locationScore +
    experienceScore +
    completedWorkScore +
    portfolioScore +
    reviewsScore +
    ratingScore -
    complaintDeductions;

  const totalScore = Math.max(0, Math.min(100, rawTotal));

  return {
    profileCompleteness: profileScore,
    identityVerification: identityScore,
    phoneVerification: phoneScore,
    locationVerification: locationScore,
    experienceEvidence: experienceScore,
    completedWorkCount: completedWorkScore,
    portfolioQuality: portfolioScore,
    verifiedReviews: reviewsScore,
    reviewReliability: ratingScore,
    complaintsDeductions: complaintDeductions,
    totalScore,
  };
}

export async function recalculateTrustScore(providerId: string): Promise<number> {
  const breakdown = await calculateTrustScore(providerId);

  await prisma.provider.update({
    where: { id: providerId },
    data: {
      trustScore: breakdown.totalScore,
    },
  });

  await prisma.trustScoreLog.create({
    data: {
      providerId,
      score: breakdown.totalScore,
      components: breakdown as any,
    },
  });

  return breakdown.totalScore;
}
