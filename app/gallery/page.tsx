import GalleryClient from "./GalleryClient";
import { getGalleryProjects } from "@/lib/content";

export const revalidate = 60;

export default async function Gallery() {
  const projects = await getGalleryProjects();
  return <GalleryClient projects={projects} />;
}
