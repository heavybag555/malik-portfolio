import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand & Contact" },
    { name: "tagline", title: "Tagline & Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      description: 'Appears in the header, e.g. "Malik Laing"',
      group: "brand",
    }),
    defineField({
      name: "brandSuffix",
      title: "Brand Suffix (italic)",
      type: "string",
      description:
        'Italic accent shown after the brand name, e.g. ", 2000"',
      group: "brand",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description: 'Used by the "Contact" link. Opens in the user\'s mail client.',
      group: "brand",
    }),
    defineField({
      name: "taglineLead",
      title: "Tagline (lead text)",
      type: "string",
      description:
        'The non-italic part of the footer tagline shown on Home + Gallery, e.g. "Photographer and director from"',
      group: "tagline",
    }),
    defineField({
      name: "taglineAccent",
      title: "Tagline (italic accent)",
      type: "string",
      description:
        'The italic accent segment rendered at the end of the tagline, e.g. "San Bernardino, California."',
      group: "tagline",
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: 'Shown in the footer on every page, e.g. "© 2026"',
      group: "tagline",
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Browser tab title (defaults to brand name if empty).",
      group: "seo",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
