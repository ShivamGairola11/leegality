import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="px-4 py-10 sm:px-6">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link href="/" className={buttonStyles()}>
            Back to products
          </Link>
        }
        className="rounded-lg bg-surface-muted"
      />
    </div>
  );
}
