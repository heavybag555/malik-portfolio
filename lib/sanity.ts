import { createClient, type SanityClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

export const isSanityConfigured = !!projectId;

export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

type SanityImageSource = {
  asset?: { _ref?: string; _id?: string };
} | null | undefined;

export function urlFor(source: SanityImageSource) {
  if (!builder) throw new Error("Sanity not configured");
  return builder.image(source as NonNullable<SanityImageSource>);
}
