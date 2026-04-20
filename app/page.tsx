import HomeClient from "./HomeClient";
import { getGalleryProjects } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const projects = await getGalleryProjects();
  return <HomeClient projects={projects} />;
}
