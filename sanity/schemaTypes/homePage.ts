import { defineType, defineField } from "sanity";

/**
 * The sole editable document in Studio: the gallery photos that render on the
 * home page. Everything else on the site (tagline, bio, metadata, contact
 * email, etc.) is intentionally hardcoded in the codebase — only images are
 * managed through the CMS.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "photos",
      title: "Gallery Photos",
      type: "array",
      description:
        "Ordered list of photos shown in the gallery. Drag to reorder.",
      of: [{ type: "galleryPhoto" }],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Gallery" }),
  },
});
