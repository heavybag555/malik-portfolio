import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Gallery")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
    ]);
