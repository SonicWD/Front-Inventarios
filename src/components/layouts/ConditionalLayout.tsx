"use client";
import { usePathname } from "next/navigation";
import { LayoutComponent } from "@/components/layouts/LayoutComponent";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si la ruta es "/login", se omite el layout global
  if (pathname === "/login") {
    return <>{children}</>;
  }
  return <LayoutComponent>{children}</LayoutComponent>;
}
