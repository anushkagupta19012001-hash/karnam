import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karnam - Connect with purpose",
  description: "Karnam seamlessly connects problems with the people best suited to solve them.",
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
