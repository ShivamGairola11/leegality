import { Suspense, type ReactNode } from "react";
import { CartIcon, ChartIcon, UserIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, SidebarTriggerFallback } from "./sidebar-trigger";

export function Navbar({ search }: { search: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-navbar shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-2 sm:gap-4 sm:px-6">
        <Suspense fallback={<SidebarTriggerFallback />}>
          <SidebarTrigger />
        </Suspense>

        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-xl">{search}</div>
        </div>

        <nav aria-label="Account" className="flex items-center">
          <Button variant="icon" size="icon" aria-label="Cart">
            <CartIcon />
          </Button>
          <Button variant="icon" size="icon" aria-label="Orders" className="max-sm:hidden">
            <ChartIcon />
          </Button>
          <Button variant="icon" size="icon" aria-label="Account">
            <UserIcon />
          </Button>
        </nav>
      </div>
    </header>
  );
}
