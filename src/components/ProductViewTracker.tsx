"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics/gtag";

export default function ProductViewTracker({
  itemId,
  itemName,
  price,
  category = "Entrenamiento Vocal",
}: {
  itemId: string;
  itemName: string;
  price: number;
  category?: string;
}) {
  useEffect(() => {
    trackViewItem({
      itemId,
      itemName,
      price,
      category,
      currency: "USD",
    });
  }, [itemId, itemName, price, category]);

  return null;
}
