import type { Metadata } from "next";
import InvitationApp from "@/components/InvitationApp";
import { wedding } from "@/data/wedding";
import { readGuestName } from "@/lib/guest";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Personal link (?to=Nama): the WhatsApp/social preview shows the couple and
// the date. The guest is addressed in the message and on the invitation itself.
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const query = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : []))
  ).toString();
  const guest = readGuestName(query);
  if (!guest) return {};
  const title = `The Wedding of ${wedding.names.display}`;
  const description = wedding.events[0].date;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: "/images/og-image-v2.jpg", width: 853, height: 853 }], type: "website" },
  };
}

export default function HomePage() {
  return <InvitationApp />;
}
