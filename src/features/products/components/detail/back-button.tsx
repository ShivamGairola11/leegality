"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { hasVisitedCatalog } from "../../lib/catalog-history";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => (hasVisitedCatalog() ? router.back() : router.push("/"))}
      className="self-start"
    >
      <ArrowLeftIcon width={14} height={14} />
      Back
    </Button>
  );
}
