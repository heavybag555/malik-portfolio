import GalleryClient from "./GalleryClient";
import { getGalleryProjects, getSiteSettings } from "@/lib/content";

export const revalidate = 60;

export default async function Gallery() {
  const [projects, settings] = await Promise.all([
    getGalleryProjects(),
    getSiteSettings(),
  ]);
  return (
    <GalleryClient
      projects={projects}
      taglineLead={settings.taglineLead}
      taglineAccent={settings.taglineAccent}
      copyrightText={settings.copyrightText}
    />
  );
}
