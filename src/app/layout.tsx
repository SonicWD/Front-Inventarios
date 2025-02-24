import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LayoutComponent } from "@/components/layouts/LayoutComponent";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Inventarios App",
  description: "Sistema de inventarios para Marina de Guatavita",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ConditionalLayout>{children}</ConditionalLayout>

        <LayoutComponent>
          {children}
        </LayoutComponent>
      </body>
    </html>
  );
}