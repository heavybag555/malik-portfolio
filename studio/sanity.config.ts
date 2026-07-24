import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title: "maliklphoto.xyz",

  projectId: "ko5xg1lg",
  dataset: "production",

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
