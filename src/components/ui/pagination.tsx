import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { getPageRange } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { buttonStyles } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label = "Pagination",
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const navButton = buttonStyles({ variant: "outline", size: "sm" });

  return (
    <nav aria-label={label} className={cn("flex items-center justify-center gap-1.5", className)}>
      <button
        type="button"
        className={navButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon width={14} height={14} />
        <span className="max-sm:sr-only">Previous</span>
      </button>

      {getPageRange(currentPage, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={buttonStyles({
              variant: item === currentPage ? "primary" : "outline",
              size: "page",
            })}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={navButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="max-sm:sr-only">Next</span>
        <ArrowRightIcon width={14} height={14} />
      </button>
    </nav>
  );
}
