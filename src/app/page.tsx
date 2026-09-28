import type { Metadata } from "next";
import InvitationApp from "@/components/InvitationApp";
import { wedding } from "@/data/wedding";
import { readGuestName } from "@/lib/guest";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Personal link (?to=Nama): name the guest in the tab title and in the
// WhatsApp/social preview so the invitation feels addressed to them.
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const query = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : []))
  ).toString();
  const guest = readGuestName(query);
  if (!guest) return {};
  const title = `Undangan untuk ${guest} — ${wedding.names.display}`;
  const description = `Kepada Yth. ${guest}, dengan penuh kebahagiaan kami mengundang Anda ke pernikahan ${wedding.names.display}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: ["/images/og-image.jpg"], type: "website" },
  };
}

export default function HomePage() {
  return <InvitationApp />;
}
