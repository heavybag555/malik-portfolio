import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      description: 'Appears in the header, e.g. "Malik Laing"',
    }),
    defineField({
      name: "brandSuffix",
      title: "Brand Suffix (italic)",
      type: "string",
      description:
        'Italic accent shown after the brand name, e.g. ", 2000"',
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description: 'Used by the "Contact" link. Opens in the user\'s mail client.',
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Browser tab title (defaults to brand name if empty).",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
