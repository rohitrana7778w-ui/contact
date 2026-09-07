import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://trustlocal.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/provider/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
