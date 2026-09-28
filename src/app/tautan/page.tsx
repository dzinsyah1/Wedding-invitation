import type { Metadata } from "next";
import GuestLinkBuilder from "@/components/tools/GuestLinkBuilder";

export const metadata: Metadata = {
  title: "Buat Tautan Tamu",
  robots: { index: false, follow: false },
};

export default function GuestLinksPage() {
  return <GuestLinkBuilder />;
}
