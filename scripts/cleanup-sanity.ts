/**
 * Deletes documents and assets that are no longer part of the schema after
 * scoping the CMS to "gallery photos only":
 *   - infoPage singleton (+ drafts)
 *   - siteSettings singleton (+ drafts)
 *   - the portrait asset that was uploaded from public/malik-info.jpg
 *   - any stripped fields on homePage (taglineLead / taglineAccent)
 *
 * Safe to re-run. Uses `drop unset` on the homePage mutation so it silently
 * no-ops if the fields are already gone.
 *
 * Usage: npm run cleanup:sanity
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";
const token = process.env.SANITY_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function deleteDocs(ids: string[]) {
  for (const id of ids) {
    try {
      await client.delete(id);
      console.log(`  [ok]   deleted ${id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/not found|does not exist/i.test(msg)) {
        console.log(`  [skip] ${id} not present`);
      } else {
        console.warn(`  [warn] failed to delete ${id}: ${msg}`);
      }
    }
  }
}

async function deletePortraitAsset() {
  // Find any image asset originally uploaded as malik-info.jpg
  const rows = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "sanity.imageAsset" && originalFilename == "malik-info.jpg"]{_id}`,
  );
  if (rows.length === 0) {
    console.log("  [skip] no portrait asset found");
    return;
  }
  for (const row of rows) {
    try {
      await client.delete(row._id);
      console.log(`  [ok]   deleted asset ${row._id}`);
    } catch (err) {
      console.warn(
        `  [warn] could not delete ${row._id}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}

async function stripHomePageLegacyFields() {
  try {
    await client
      .patch("homePage")
      .unset(["taglineLead", "taglineAccent"])
      .commit({ autoGenerateArrayKeys: false });
    console.log("  [ok]   stripped taglineLead / taglineAccent from homePage");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/not found|does not exist/i.test(msg)) {
      console.log("  [skip] homePage document not present");
    } else {
      console.warn(`  [warn] homePage patch failed: ${msg}`);
    }
  }
}

async function main() {
  console.log(`Cleaning up Sanity project "${projectId}" (dataset: ${dataset})\n`);

  console.log("Deleting documents...");
  await deleteDocs([
    "infoPage",
    "drafts.infoPage",
    "siteSettings",
    "drafts.siteSettings",
  ]);

  console.log("\nDeleting portrait asset...");
  await deletePortraitAsset();

  console.log("\nTrimming homePage legacy fields...");
  await stripHomePageLegacyFields();

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nCleanup failed:", err);
  process.exit(1);
});
