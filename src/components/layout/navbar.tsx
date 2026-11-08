import { Suspense, type ReactNode } from "react";
import { SidebarTrigger, SidebarTriggerFallback } from "./sidebar-trigger";

interface NavbarProps {
  search: ReactNode;
  actions: ReactNode;
}

export function Navbar({ search, actions }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-navbar shadow-sm">
      <div className="flex h-14 items-center gap-2 px-2 sm:gap-4 sm:px-6">
        <Suspense fallback={<SidebarTriggerFallback />}>
          <SidebarTrigger />
        </Suspense>

        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-xl">{search}</div>
        </div>

        <nav aria-label="Account" className="flex items-center gap-1">
          {actions}
        </nav>
      </div>
    </header>
  );
}
