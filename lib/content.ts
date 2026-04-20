/**
 * Content fetching layer.
 *
 * Gallery photos are sourced exclusively from Sanity. If Sanity is not
 * configured or the fetch fails, the gallery renders empty.
 */

import { client, isSanityConfigured, urlFor } from "./sanity";
import { galleryQuery } from "./queries";

// Shape consumed by the home gallery.
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  width?: number;
  height?: number;
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
  if (!isSanityConfigured || !client) {
    console.warn("[sanity] not configured — gallery will render empty");
    return [];
  }

  let raw: RawGallery | null = null;
  try {
    raw = await client.fetch<RawGallery | null>(galleryQuery);
  } catch (err) {
    console.warn("[sanity] gallery fetch failed:", err);
    return [];
  }
  if (!raw || !Array.isArray(raw.photos) || raw.photos.length === 0) {
    return [];
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
