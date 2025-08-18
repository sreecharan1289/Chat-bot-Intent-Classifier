import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Playground",
  description: "Simple Next.js + Tailwind UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
