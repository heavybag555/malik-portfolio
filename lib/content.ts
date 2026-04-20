/**
 * Content fetching layer.
 *
 * Only the gallery photos come from Sanity. If Sanity is not configured (no
 * project id / dataset in env) the helper falls back to the bundled local
 * metadata + `public/ML-photos/` assets so the site still renders.
 */

import { client, isSanityConfigured, urlFor } from "./sanity";
import { galleryQuery } from "./queries";
import photoMetadata from "@/app/photoMetadata.json";
import { photoOrder } from "@/data/photoOrder";

// Shape consumed by the home gallery. Matches the pre-migration Project type.
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  width?: number;
  height?: number;
}

// ---- Local fallback --------------------------------------------------------

/**
 * Build projects from the bundled JSON + filename list. Used when Sanity is
 * not configured. Remove once the local assets are deleted post-verification.
 */
function buildLocalProjects(): Project[] {
  type Meta = { filename: string; title?: string; description?: string };
  const metaMap = new Map<string, Meta>(
    (photoMetadata as Meta[]).map((m) => [m.filename, m])
  );
  return photoOrder.map((file, i) => {
    const meta = metaMap.get(file);
    return {
      id: i + 1,
      title: meta?.title ?? `Project ${i + 1}`,
      description: meta?.description ?? "Description",
      image: `/ML-photos/${file}`,
    };
  });
}

// ---- Raw Sanity response shapes -------------------------------------------

interface RawImage {
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: { dimensions?: { width?: number; height?: number } };
  };
  hotspot?: unknown;
  crop?: unknown;
}

interface RawGallery {
  photos?: Array<{
    title?: string;
    description?: string;
    year?: number;
    image?: RawImage;
  }>;
}

// ---- Helpers ---------------------------------------------------------------

/** Combine description + year into the single caption line the UI renders. */
function composeCaption(description?: string, year?: number): string {
  const parts: string[] = [];
  if (description && description.trim().length > 0) parts.push(description.trim());
  if (typeof year === "number" && Number.isFinite(year)) parts.push(String(year));
  return parts.join(", ");
}

/**
 * Build a Sanity CDN URL. The gallery grid + lightbox request up to ~1200px
 * wide, so 1600 gives next/image headroom to downscale per srcset.
 */
function buildImageUrl(image: RawImage | undefined, maxWidth = 1600): string {
  if (!image?.asset) return "";
  try {
    return urlFor(image).width(maxWidth).auto("format").fit("max").url();
  } catch {
    return image.asset.url ?? "";
  }
}

// ---- Public fetcher --------------------------------------------------------

export async function getGalleryProjects(): Promise<Project[]> {
  if (!isSanityConfigured || !client) return buildLocalProjects();

  let raw: RawGallery | null = null;
  try {
    raw = await client.fetch<RawGallery | null>(galleryQuery);
  } catch (err) {
    console.warn("[sanity] gallery fetch failed, using local fallback:", err);
    return buildLocalProjects();
  }
  if (!raw || !Array.isArray(raw.photos) || raw.photos.length === 0) {
    return buildLocalProjects();
  }

  const projects: Project[] = [];
  raw.photos.forEach((p, i) => {
    const url = buildImageUrl(p.image);
    if (!url) return;
    const dims = p.image?.asset?.metadata?.dimensions;
    projects.push({
      id: i + 1,
      title: p.title ?? `Project ${i + 1}`,
      description: composeCaption(p.description, p.year),
      image: url,
      width: dims?.width,
      height: dims?.height,
    });
  });

  return projects;
}
