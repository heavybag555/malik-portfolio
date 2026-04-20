/**
 * Seeds Sanity with the gallery photos from public/ML-photos/ and creates
 * the `homePage` document containing them. Only the gallery lives in Sanity;
 * everything else on the site is hardcoded.
 *
 * Idempotent: safe to re-run. Assets already uploaded (matched by SHA-1) are
 * re-used by Sanity; the homePage document is upserted by fixed _id.
 *
 * Usage:  npm run seed:sanity
 * Required env (.env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *   SANITY_TOKEN=<editor or write token>
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";
import photoMetadata from "../app/photoMetadata.json";
import { photoOrder } from "../data/photoOrder";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";
const token = process.env.SANITY_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env vars. Add to .env.local:\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>\n" +
      "  NEXT_PUBLIC_SANITY_DATASET=production\n" +
      "  SANITY_TOKEN=<editor token from sanity.io/manage → API → Tokens>\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

interface Metadata {
  filename: string;
  title?: string;
  description?: string;
}

const metaMap = new Map<string, Metadata>(
  (photoMetadata as Metadata[]).map((m) => [m.filename, m]),
);

/**
 * Parses legacy "Location, YYYY" (or just "YYYY") captions into separate
 * description + year fields for Sanity.
 */
function splitCaption(caption?: string): {
  description: string;
  year?: number;
} {
  if (!caption) return { description: "" };
  const trimmed = caption.trim();
  if (!trimmed) return { description: "" };
  const onlyYear = /^(\d{4})$/.exec(trimmed);
  if (onlyYear) return { description: "", year: Number(onlyYear[1]) };
  const match = /^(.*),\s*(\d{4})$/.exec(trimmed);
  if (match) return { description: match[1].trim(), year: Number(match[2]) };
  return { description: trimmed };
}

const PHOTOS_DIR = path.join(process.cwd(), "public", "ML-photos");

function contentTypeFor(ext: string): string {
  const e = ext.replace(".", "").toLowerCase();
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  if (e === "gif") return "image/gif";
  return "application/octet-stream";
}

async function uploadImage(filePath: string, filename: string) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${filePath}`);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: contentTypeFor(ext),
  });
  return asset._id;
}

async function seedPhotos() {
  console.log(`Uploading ${photoOrder.length} gallery photos...`);
  const photos: Array<{
    _key: string;
    _type: "galleryPhoto";
    title: string;
    description: string;
    year?: number;
    image: { _type: "image"; asset: { _type: "reference"; _ref: string } };
  }> = [];

  for (let i = 0; i < photoOrder.length; i++) {
    const filename = photoOrder[i];
    const meta = metaMap.get(filename);
    const filePath = path.join(PHOTOS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`  [skip] Missing file: ${filename}`);
      continue;
    }

    process.stdout.write(
      `  [${String(i + 1).padStart(3, " ")}/${photoOrder.length}] ${filename}\n`,
    );

    const assetId = await uploadImage(filePath, filename);
    const { description, year } = splitCaption(meta?.description);

    photos.push({
      _key: `photo_${i}`,
      _type: "galleryPhoto",
      title: meta?.title ?? `Project ${i + 1}`,
      description,
      ...(year !== undefined ? { year } : {}),
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      },
    });
  }
  return photos;
}

async function main() {
  console.log(`Seeding Sanity project "${projectId}" (dataset: ${dataset})\n`);

  const photos = await seedPhotos();

  console.log("\nUpserting homePage...");
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    photos,
  });

  console.log(`\nDone. Seeded ${photos.length} gallery photos.`);
  console.log("Open /studio to edit.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
