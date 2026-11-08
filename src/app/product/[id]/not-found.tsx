import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProductNotFound() {
  return (
    <div className="px-4 py-10 sm:px-6">
      <EmptyState
        title="Product not found"
        description="This product doesn't exist or is no longer available."
        action={
          <Link href="/" className={buttonStyles()}>
            Browse products
          </Link>
        }
        className="rounded-lg bg-surface-muted"
      />
    </div>
  );
}
