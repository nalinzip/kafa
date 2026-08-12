import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K.A.F.A. - Korea-ASEAN Flood Assistance System",
  description:
    "A responsive Aceh Utara flood management and emergency decision-support prototype using simulated data.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
