import { defineType, defineField } from "sanity";

/**
 * The gallery photos that render on the home page and gallery grid. Site-wide
 * copy (tagline, contact, brand) lives in `siteSettings`; the Info page's
 * bio/portrait live in `infoPage`.
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
