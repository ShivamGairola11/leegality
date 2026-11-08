import { Badge } from "@/components/ui/badge";
import { getStockLevel } from "../lib/pricing";

interface StockStatusProps {
  stock: number;
  hideWhenInStock?: boolean;
}

export function StockStatus({ stock, hideWhenInStock = false }: StockStatusProps) {
  const level = getStockLevel(stock);

  if (level === "out") return <Badge tone="danger">Out of stock</Badge>;
  if (level === "low") return <Badge tone="warning">Only {stock} left</Badge>;
  if (hideWhenInStock) return null;
  return <Badge tone="success">In stock</Badge>;
}
