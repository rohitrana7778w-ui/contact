import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { RatingStars } from "@/components/rating-stars";
import { formatDate } from "@/lib/utils";

export default async function CustomerReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/reviews");
  }

  const reviews = await prisma.review.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: {
          businessName: true,
          slug: true,
          locality: true,
          trustScore: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Customer Experience</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Submitted Reviews ({reviews.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your honest ratings help Dehradun residents choose verified local professionals and reward high-trust trade craftsmanship.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Star className="w-7 h-7 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No reviews submitted yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              After hiring an electrician, plumber, or mechanic through the platform, leave a multi-factor review directly on their profile.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/provider/${r.provider.slug}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600"
                      >
                        {r.provider.businessName}
                      </Link>
                      <span className="text-xs text-slate-400">· {r.provider.locality || "Dehradun"}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <RatingStars rating={r.overallRating} size="sm" />
                      {r.service && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {r.service.name}
                        </span>
                      )}
                      {r.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Client Review
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {formatDate(r.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {r.text}
                </p>

                {/* Sub-ratings breakdown */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>Quality: <span className="font-bold text-slate-700">{r.qualityRating}/5</span></div>
                  <div>Pricing: <span className="font-bold text-slate-700">{r.pricingRating}/5</span></div>
                  <div>Timeliness: <span className="font-bold text-slate-700">{r.timelinessRating}/5</span></div>
                  <div>Behavior: <span className="font-bold text-slate-700">{r.behaviorRating}/5</span></div>
                </div>

                {r.providerResponse && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700">
                    <strong className="text-blue-900 font-bold block mb-0.5">
                      Provider Response:
                    </strong>
                    <p className="italic">{r.providerResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
