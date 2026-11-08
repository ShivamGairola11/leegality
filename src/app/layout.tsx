import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import { ProductSearch, ProductSearchFallback } from "@/features/products/components/product-search";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Product Catalog",
    template: "%s | Product Catalog",
  },
  description: "Browse, filter and explore products from the DummyJSON catalog.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SidebarProvider>
          <Navbar
            search={
              <Suspense fallback={<ProductSearchFallback />}>
                <ProductSearch />
              </Suspense>
            }
          />
          <main className="flex-1">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
