import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "malik-portfolio",
  title: "Malik Laing",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (prev) =>
      prev.filter(
        (t) =>
          t.schemaType !== "homePage" &&
          t.schemaType !== "infoPage" &&
          t.schemaType !== "siteSettings"
      ),
  },
  document: {
    actions: (prev, { schemaType }) => {
      const singletons = new Set(["homePage", "infoPage", "siteSettings"]);
      if (singletons.has(schemaType)) {
        return prev.filter(
          (a) =>
            a.action !== "duplicate" &&
            a.action !== "delete" &&
            a.action !== "unpublish"
        );
      }
      return prev;
    },
  },
});
