import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мои ссылки",
  description: "Личная страница со ссылками",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-neutral-100 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
