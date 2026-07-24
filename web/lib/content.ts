/**
 * Content fetching layer.
 *
 * All editorial content (gallery photos, Info page bio/portrait, and
 * site-wide brand/contact/tagline copy) is sourced exclusively from Sanity.
 * If Sanity is not configured or a fetch fails, each helper falls back to
 * the site's original launch copy so the UI never renders blank/broken.
 */

import { client, isSanityConfigured, urlFor } from "./sanity";
import { galleryQuery, infoPageQuery, siteSettingsQuery } from "./queries";

// Shape consumed by the home gallery.
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  width?: number;
  height?: number;
}

export interface InfoContent {
  portraitUrl: string | null;
  portraitAlt: string;
  portraitWidth?: number;
  portraitHeight?: number;
  bioParagraphs: string[];
  instagramHandle: string;
  instagramUrl: string;
}

export interface SiteSettingsContent {
  brandName: string;
  brandSuffix: string;
  contactEmail: string;
  taglineLead: string;
  taglineAccent: string;
  copyrightText: string;
  metaTitle: string;
  metaDescription: string;
}

// ---- Defaults (mirror the site's original hardcoded copy) ------------------

const DEFAULT_INFO: InfoContent = {
  portraitUrl: null,
  portraitAlt: "Malik Laing",
  bioParagraphs: [
    "Malik Laing [b. 2000] is an independent photographer hailing from San Bernardino, California.",
    "For years, he has been enveloped in the world of photography, inside and out. His lengthiest project, the community photography space Eclipse is a testament to the communal and personal themes in his work. Some of his material has been publicly featured at the Riverside Art Museum and alongside The Civil Rights Institute of Southern California.",
  ],
  instagramHandle: "@maliklphoto",
  instagramUrl: "https://www.instagram.com/maliklphoto/",
};

const DEFAULT_SETTINGS: SiteSettingsContent = {
  brandName: "Malik Laing",
  brandSuffix: ", 2000",
  contactEmail: "maliklphoto1@gmail.com",
  taglineLead: "Photographer and director from",
  taglineAccent: "San Bernardino, California.",
  copyrightText: "© 2026",
  metaTitle: "malik laing",
  metaDescription: "Photography portfolio of Malik",
};

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

interface RawInfo {
  portrait?: RawImage;
  portraitAlt?: string;
  bioParagraphs?: string[];
  instagramHandle?: string;
  instagramUrl?: string;
}

interface RawSettings {
  brandName?: string;
  brandSuffix?: string;
  contactEmail?: string;
  taglineLead?: string;
  taglineAccent?: string;
  copyrightText?: string;
  metaTitle?: string;
  metaDescription?: string;
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

// ---- Public fetchers --------------------------------------------------------

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

export async function getInfoContent(): Promise<InfoContent> {
  if (!isSanityConfigured || !client) return DEFAULT_INFO;

  let raw: RawInfo | null = null;
  try {
    raw = await client.fetch<RawInfo | null>(infoPageQuery);
  } catch (err) {
    console.warn("[sanity] infoPage fetch failed, using defaults:", err);
    return DEFAULT_INFO;
  }
  if (!raw) return DEFAULT_INFO;

  const portraitUrl = buildImageUrl(raw.portrait, 1200) || DEFAULT_INFO.portraitUrl;
  const dims = raw.portrait?.asset?.metadata?.dimensions;

  const bioParagraphs =
    Array.isArray(raw.bioParagraphs) && raw.bioParagraphs.length > 0
      ? raw.bioParagraphs.filter((s) => typeof s === "string" && s.length > 0)
      : DEFAULT_INFO.bioParagraphs;

  return {
    portraitUrl,
    portraitAlt: raw.portraitAlt || DEFAULT_INFO.portraitAlt,
    portraitWidth: dims?.width,
    portraitHeight: dims?.height,
    bioParagraphs,
    instagramHandle: raw.instagramHandle || DEFAULT_INFO.instagramHandle,
    instagramUrl: raw.instagramUrl || DEFAULT_INFO.instagramUrl,
  };
}

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  if (!isSanityConfigured || !client) return DEFAULT_SETTINGS;

  let raw: RawSettings | null = null;
  try {
    raw = await client.fetch<RawSettings | null>(siteSettingsQuery);
  } catch (err) {
    console.warn("[sanity] siteSettings fetch failed, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
  if (!raw) return DEFAULT_SETTINGS;

  return {
    brandName: raw.brandName || DEFAULT_SETTINGS.brandName,
    brandSuffix: raw.brandSuffix ?? DEFAULT_SETTINGS.brandSuffix,
    contactEmail: raw.contactEmail || DEFAULT_SETTINGS.contactEmail,
    taglineLead: raw.taglineLead || DEFAULT_SETTINGS.taglineLead,
    taglineAccent: raw.taglineAccent || DEFAULT_SETTINGS.taglineAccent,
    copyrightText: raw.copyrightText || DEFAULT_SETTINGS.copyrightText,
    metaTitle: raw.metaTitle || raw.brandName || DEFAULT_SETTINGS.metaTitle,
    metaDescription: raw.metaDescription || DEFAULT_SETTINGS.metaDescription,
  };
}
