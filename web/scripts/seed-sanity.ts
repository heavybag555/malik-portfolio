/**
 * Seeds Sanity with all of the site's local content:
 *   - Gallery photos from public/ML-photos/ -> homePage.photos[]
 *   - Portrait from public/malik-info.jpg -> infoPage.portrait
 *   - Bio, Instagram -> infoPage
 *   - Brand, contact, tagline, copyright, SEO -> siteSettings
 *
 * Idempotent: safe to re-run. Assets already uploaded (matched by SHA-1) are
 * re-used by Sanity; documents are upserted by fixed _id.
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

// Gallery order mirrors the order photos appear in photoMetadata.json.
const photoOrder: string[] = (photoMetadata as Array<{ filename: string }>).map(
  (m) => m.filename,
);

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

const PUBLIC_DIR = path.join(process.cwd(), "public");
const PHOTOS_DIR = path.join(PUBLIC_DIR, "ML-photos");
const PORTRAIT_PATH = path.join(PUBLIC_DIR, "malik-info.jpg");

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

async function seedPortrait() {
  if (!fs.existsSync(PORTRAIT_PATH)) {
    console.warn(`[skip] Portrait not found at ${PORTRAIT_PATH}`);
    return null;
  }
  console.log("Uploading portrait (malik-info.jpg)...");
  return uploadImage(PORTRAIT_PATH, "malik-info.jpg");
}

async function main() {
  console.log(`Seeding Sanity project "${projectId}" (dataset: ${dataset})\n`);

  const photos = await seedPhotos();
  const portraitAssetId = await seedPortrait();

  console.log("\nUpserting homePage...");
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    photos,
  });

  console.log("Upserting infoPage...");
  await client.createOrReplace({
    _id: "infoPage",
    _type: "infoPage",
    portraitAlt: "Malik Laing",
    bioParagraphs: [
      "Malik Laing [b. 2000] is an independent photographer hailing from San Bernardino, California.",
      "For years, he has been enveloped in the world of photography, inside and out. His lengthiest project, the community photography space Eclipse is a testament to the communal and personal themes in his work. Some of his material has been publicly featured at the Riverside Art Museum and alongside The Civil Rights Institute of Southern California.",
    ],
    instagramHandle: "@maliklphoto",
    instagramUrl: "https://www.instagram.com/maliklphoto/",
    ...(portraitAssetId
      ? {
          portrait: {
            _type: "image",
            asset: { _type: "reference", _ref: portraitAssetId },
          },
        }
      : {}),
  });

  console.log("Upserting siteSettings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    brandName: "Malik Laing",
    brandSuffix: ", 2000",
    contactEmail: "maliklphoto1@gmail.com",
    taglineLead: "Photographer and director from",
    taglineAccent: "San Bernardino, California.",
    copyrightText: "© 2026",
    metaTitle: "malik laing",
    metaDescription: "Photography portfolio of Malik",
  });

  console.log(
    `\nDone. Seeded ${photos.length} gallery photos + portrait + info page + site settings.`,
  );
  console.log("Run `npm run dev` in ../studio to edit.");
}

main().catch((err) => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
