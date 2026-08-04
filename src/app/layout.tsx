import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "翁記麻辣鍋板橋店｜營運情報訂閱",
  description:
    "專為新北市板橋區篤行路三段28號翁記麻辣鍋板橋店打造的每月營運情報網頁：競品雷達、自營外帶、菜單工程與淡季策略。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
