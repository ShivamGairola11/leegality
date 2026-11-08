import type { ReactNode } from "react";
import { ReturnIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import type { Product } from "../../types";

type ProductHighlightsProps = Pick<
  Product,
  "shippingInformation" | "warrantyInformation" | "returnPolicy"
>;

function Highlight({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="text-sm">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-slate-500">{value}</p>
      </div>
    </li>
  );
}

export function ProductHighlights({
  shippingInformation,
  warrantyInformation,
  returnPolicy,
}: ProductHighlightsProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
      <Highlight icon={<TruckIcon width={16} height={16} />} label="Delivery" value={shippingInformation} />
      <Highlight icon={<ShieldIcon width={16} height={16} />} label="Warranty" value={warrantyInformation} />
      <Highlight icon={<ReturnIcon width={16} height={16} />} label="Returns" value={returnPolicy} />
    </ul>
  );
}
