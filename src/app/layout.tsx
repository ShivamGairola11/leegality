import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ProfileButton } from "@/components/layout/profile-button";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import { Toaster } from "@/components/ui/toaster";
import { CartLink } from "@/features/cart/components/cart-link";
import { CartRail } from "@/features/cart/components/cart-rail";
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
            actions={
              <>
                <CartLink />
                <ProfileButton />
              </>
            }
          />
          <div className="flex flex-1">
            <main className="flex min-w-0 flex-1 flex-col">{children}</main>
            <Suspense>
              <CartRail />
            </Suspense>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
