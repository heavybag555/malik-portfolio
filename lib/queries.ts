// GROQ query for the gallery. Only photos live in Sanity; everything else
// on the site is hardcoded in the codebase.

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
