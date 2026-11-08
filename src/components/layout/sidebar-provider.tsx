/*
 * Shares the filter sidebar state between the navbar menu button and the
 * catalog. On desktop the button collapses the sidebar; on smaller screens
 * it opens the sidebar as a drawer.
 */
"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

interface SidebarContextValue {
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isDesktopOpen, setDesktopOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const value = useMemo<SidebarContextValue>(
    () => ({
      isDesktopOpen,
      isMobileOpen,
      toggle: () =>
        window.matchMedia(DESKTOP_QUERY).matches
          ? setDesktopOpen((open) => !open)
          : setMobileOpen((open) => !open),
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
    }),
    [isDesktopOpen, isMobileOpen],
  );

  return <SidebarContext value={value}>{children}</SidebarContext>;
}

export function useSidebar() {
  const context = use(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return context;
}
