import InfoClient from "./InfoClient";
import { getInfoContent, getSiteSettings } from "@/lib/content";

export const revalidate = 60;

export default async function InfoPage() {
  const [info, settings] = await Promise.all([
    getInfoContent(),
    getSiteSettings(),
  ]);
  return (
    <InfoClient
      portraitUrl={info.portraitUrl}
      portraitAlt={info.portraitAlt}
      portraitWidth={info.portraitWidth}
      portraitHeight={info.portraitHeight}
      bioParagraphs={info.bioParagraphs}
      instagramHandle={info.instagramHandle}
      instagramUrl={info.instagramUrl}
      contactEmail={settings.contactEmail}
      copyrightText={settings.copyrightText}
    />
  );
}
