import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (files in ./fonts, from Google Fonts) so builds never depend on
// fetching fonts.googleapis.com, which can fail on the build server.
const display = localFont({
  src: "./fonts/cormorant-garamond-all.woff2",
  weight: "400 700",
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "./fonts/nunito-all.woff2",
  weight: "400 700",
  variable: "--font-body",
  display: "swap",
});

const script = localFont({
  src: "./fonts/great-vibes-all.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const arabic = localFont({
  src: [
    { path: "./fonts/amiri-400.woff2", weight: "400" },
    { path: "./fonts/amiri-700.woff2", weight: "700" },
  ],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-dzinsyah-titin.web.id"),
  title: "Dzin Syah & Titin — Wedding Invitation",
  description:
    "Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",
  openGraph: {
    title: "Dzin Syah & Titin — Wedding Invitation",
    description:
      "Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.",
    images: ["/images/og-image.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f0c878",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${display.variable} ${body.variable} ${script.variable} ${arabic.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
