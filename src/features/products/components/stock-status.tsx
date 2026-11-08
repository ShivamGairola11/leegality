import { Badge } from "@/components/ui/badge";
import { getStockLevel } from "../lib/pricing";

interface StockStatusProps {
  stock: number;
  variant?: "badge" | "text";
}

export function StockStatus({ stock, variant = "badge" }: StockStatusProps) {
  const level = getStockLevel(stock);

  if (variant === "text") {
    if (level === "in") return null;
    return (
      <p className="text-xs font-medium text-deal">
        {level === "out" ? "Currently unavailable" : `Only ${stock} left in stock`}
      </p>
    );
  }

  if (level === "out") return <Badge tone="danger">Out of stock</Badge>;
  if (level === "low") return <Badge tone="warning">Only {stock} left</Badge>;
  return <Badge tone="success">In stock</Badge>;
}
