"use client";

import { UserIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

export function ProfileButton() {
  return (
    <Button
      variant="icon"
      size="icon"
      aria-label="Account"
      onClick={() =>
        toast({
          title: "This is a demo",
          description: "Sign-in and accounts aren't part of this project.",
        })
      }
    >
      <UserIcon width={22} height={22} />
    </Button>
  );
}
