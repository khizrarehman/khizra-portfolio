import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** The site is a single page; its chapters are anchors on it, not separate URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/", siteUrl()).toString(), changeFrequency: "monthly", priority: 1 }];
}
