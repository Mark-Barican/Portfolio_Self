import type { MetadataRoute } from "next";
import { LEGAL_LINKS, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Real routes, so they belong here. Low priority and rarely revised.
    ...LEGAL_LINKS.map((item) => ({
      url: `${SITE.url}${item.href}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
