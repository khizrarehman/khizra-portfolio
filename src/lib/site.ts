/**
 * The site's public origin, for metadata that needs absolute URLs
 * (canonical, Open Graph, sitemap, robots).
 *
 * No domain is hardcoded. In order:
 * 1. NEXT_PUBLIC_SITE_URL — set this once the real domain is known
 *    (e.g. in Vercel → Settings → Environment Variables).
 * 2. VERCEL_PROJECT_PRODUCTION_URL — provided automatically on Vercel:
 *    the custom domain if one is assigned, otherwise the project's
 *    *.vercel.app address.
 * 3. http://localhost:3000 for local builds.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}
