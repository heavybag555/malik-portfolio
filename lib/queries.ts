// GROQ queries. Kept small and explicit so the mapping layer in
// lib/content.ts can reshape results into the exact frontend contract.

export const galleryQuery = `*[_type == "homePage"][0]{
  photos[]{
    title,
    description,
    year,
    image{
      asset->{ _id, url, metadata { dimensions { width, height } } },
      hotspot,
      crop
    }
  }
}`;

export const infoPageQuery = `*[_type == "infoPage"][0]{
  portraitAlt,
  bioParagraphs,
  instagramHandle,
  instagramUrl,
  portrait{
    asset->{ _id, url, metadata { dimensions { width, height } } },
    hotspot,
    crop
  }
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  brandName,
  brandSuffix,
  contactEmail,
  taglineLead,
  taglineAccent,
  copyrightText,
  metaTitle,
  metaDescription
}`;
