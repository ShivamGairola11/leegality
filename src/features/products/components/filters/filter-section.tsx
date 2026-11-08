import type { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section>
      <h3 className="mb-2 text-sm font-bold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}
