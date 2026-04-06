import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetPro Coffee POS",
  description: "ระบบขายหน้าร้าน MeetPro",
};

// เพิ่มส่วนนี้เพื่อบังคับให้หน้าจอพอดีมือถือ 100%
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}