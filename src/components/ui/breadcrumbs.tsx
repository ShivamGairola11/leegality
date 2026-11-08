import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-1 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex min-w-0 items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="shrink-0 hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="truncate text-slate-700">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRightIcon width={14} height={14} className="shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
