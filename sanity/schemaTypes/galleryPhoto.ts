import { defineType, defineField } from "sanity";

export const galleryPhoto = defineType({
  name: "galleryPhoto",
  title: "Photo",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'Caption line 1 (e.g. "Dae")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: 'Location or short caption shown before the year (e.g. "Redlands"). May be left blank.',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description: "Year the photo was taken. Shown after the description.",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      year: "year",
      media: "image",
    },
    prepare({ title, description, year }) {
      const parts = [description, year].filter(Boolean);
      return {
        title: title || "(untitled)",
        subtitle: parts.join(", "),
      };
    },
  },
});
