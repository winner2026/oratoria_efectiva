"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ConversionTracker() {
  const hasFired = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const transactionId = searchParams.get("transaction") || searchParams.get("transaction_id") || `hotmart_${Date.now()}`;

    if (typeof window !== "undefined" && window.gtag) {
      // GA4 purchase event
      window.gtag("event", "purchase", {
        transaction_id: transactionId,
        value: 17.0,
        currency: "USD",
        items: [
          {
            item_id: "sin-miedo-a-hablar",
            item_name: "Sin Miedo a Hablar",
            price: 17.0,
            quantity: 1,
          },
        ],
      });

      // Google Ads conversion event
      window.gtag("event", "conversion", {
        send_to: "AW-18488283276/purchase",
        value: 17.0,
        currency: "USD",
        transaction_id: transactionId,
      });
    }
  }, [searchParams]);

  return null;
}
