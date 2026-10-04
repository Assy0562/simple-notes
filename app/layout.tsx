import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "\u30b7\u30f3\u30d7\u30eb\u30e1\u30e2 | \u30e1\u30e2\u5e33\u30a2\u30d7\u30ea",
  description:
    "\u691c\u7d22\u3001\u30bf\u30b0\u3001\u30d4\u30f3\u7559\u3081\u3001\u30a2\u30fc\u30ab\u30a4\u30d6\u3067\u6574\u7406\u3067\u304d\u308b\u30b7\u30f3\u30d7\u30eb\u306a\u30e1\u30e2\u5e33\u30a2\u30d7\u30ea\u3067\u3059\u3002",
};

const initializeTheme = `(() => {
  try {
    const saved = localStorage.getItem("simple-notion-theme");
    const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme =
      saved === "dark" || (saved !== "light" && systemDark) ? "dark" : "light";
  } catch {
    // 保存領域を使えない場合はCSSと画面側の既定値に任せる。
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
