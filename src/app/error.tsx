"use client";

import { useEffect } from "react";
import { AlertIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-4 py-10 sm:px-6">
      <EmptyState
        icon={<AlertIcon width={40} height={40} className="text-red-500" />}
        title="Something went wrong"
        description="We couldn't load products right now. Check your connection and try again."
        action={<Button onClick={retry}>Try again</Button>}
        className="rounded-lg bg-surface-muted"
      />
    </div>
  );
}
