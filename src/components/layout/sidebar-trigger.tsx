"use client";

import { usePathname, useRouter } from "next/navigation";
import { MenuIcon } from "@/components/icons";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useSidebar } from "./sidebar-provider";

function MenuButton(props: ButtonProps) {
  return (
    <Button variant="icon" size="icon" aria-label="Toggle filters" {...props}>
      <MenuIcon width={22} height={22} />
    </Button>
  );
}

export function SidebarTrigger() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useSidebar();

  return <MenuButton onClick={() => (pathname === "/" ? toggle() : router.push("/"))} />;
}

export function SidebarTriggerFallback() {
  return <MenuButton disabled />;
}
