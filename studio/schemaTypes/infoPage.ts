import { defineType, defineField } from "sanity";

export const infoPage = defineType({
  name: "infoPage",
  title: "Info Page",
  type: "document",
  fields: [
    defineField({
      name: "portrait",
      title: "Portrait Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitAlt",
      title: "Portrait Alt Text",
      type: "string",
      description: "Accessibility description for the portrait image.",
    }),
    defineField({
      name: "bioParagraphs",
      title: "Bio Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description:
        "Each entry is one paragraph of the bio, in order, as shown on the Info page.",
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle (display)",
      type: "string",
      description: 'Text shown for the Instagram link, e.g. "@maliklphoto"',
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      description: "Full URL the Instagram handle links to.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Info Page" }),
  },
});
