import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/store/Providers";

export const metadata: Metadata = {
  title: "Digital Pathshala | Finance Management System",
  description: "Internal accounting system for Digital Pathshala",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}