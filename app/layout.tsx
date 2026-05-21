import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "\u30b7\u30f3\u30d7\u30eb\u30e1\u30e2 | \u30e1\u30e2\u5e33\u30a2\u30d7\u30ea",
  description:
    "Next.js\u3067\u4f5c\u308b\u30b7\u30f3\u30d7\u30eb\u306a\u30e1\u30e2\u5e33\u30a2\u30d7\u30ea\u3067\u3059\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
