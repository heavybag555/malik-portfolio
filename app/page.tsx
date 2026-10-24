import HomeClient from "./HomeClient";
import { getGalleryProjects, getSiteSettings } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getGalleryProjects(),
    getSiteSettings(),
  ]);
  return (
    <HomeClient
      projects={projects}
      taglineLead={settings.taglineLead}
      taglineAccent={settings.taglineAccent}
      copyrightText={settings.copyrightText}
    />
  );
}
