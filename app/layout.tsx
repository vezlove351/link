import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Groups",
  description: "Grouped link pages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-100 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
