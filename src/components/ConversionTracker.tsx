"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackPurchase } from "@/lib/analytics/gtag";

export default function ConversionTracker() {
  const hasFired = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    // Detectar ID de transacción de Hotmart o generar uno único
    const transactionId =
      searchParams.get("transaction") ||
      searchParams.get("transaction_id") ||
      searchParams.get("order") ||
      `order_${Date.now()}`;

    // Detectar producto adquirido a través de parámetros de URL de Hotmart
    const productParam = (
      searchParams.get("product") ||
      searchParams.get("prod") ||
      searchParams.get("item") ||
      ""
    ).toLowerCase();

    const priceParam = parseFloat(searchParams.get("price") || searchParams.get("value") || "0");

    let itemId = "sin-miedo-a-hablar";
    let itemName = "Sin Miedo a Hablar";
    let price = 29.0;
    let category = "Curso Online";

    if (
      productParam.includes("protocolo") ||
      productParam.includes("libro") ||
      productParam.includes("108091621")
    ) {
      itemId = "protocolo-de-respuestas-inteligentes";
      itemName = "Protocolo de Respuestas Inteligentes";
      price = 17.0;
      category = "Libro Digital";
    }

    if (priceParam > 0) {
      price = priceParam;
    }

    // Disparar evento oficial purchase en GA4 y conversión en Google Ads
    trackPurchase({
      transactionId,
      value: price,
      currency: "USD",
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price,
          item_category: category,
          quantity: 1,
        },
      ],
    });
  }, [searchParams]);

  return null;
}
