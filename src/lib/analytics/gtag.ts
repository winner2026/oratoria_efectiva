/**
 * Módulo de Integración Oficial con Google Analytics 4 (GA4) y Google Ads
 * ID Medición GA4: G-K54S39NNTD
 * ID Google Ads: AW-18488283276
 */

export const GA_MEASUREMENT_ID = "G-K54S39NNTD";
export const GOOGLE_ADS_ID = "AW-18488283276";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface EcomItem {
  item_id: string;
  item_name: string;
  price: number;
  item_category?: string;
  item_variant?: string;
  quantity?: number;
}

/**
 * Registra una vista de página explícita
 */
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

/**
 * Dispara evento oficial GA4 view_item cuando un visitante mira la oferta de un producto
 */
export function trackViewItem({
  itemId,
  itemName,
  price,
  category = "Entrenamiento Vocal",
  currency = "USD",
}: {
  itemId: string;
  itemName: string;
  price: number;
  category?: string;
  currency?: string;
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "view_item", {
      currency,
      value: price,
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
  }
}

/**
 * Dispara evento oficial GA4 begin_checkout al hacer clic en "Comprar Ahora"
 */
export function trackBeginCheckout({
  itemId,
  itemName,
  price,
  category = "Entrenamiento Vocal",
  currency = "USD",
  location = "hero",
}: {
  itemId: string;
  itemName: string;
  price: number;
  category?: string;
  currency?: string;
  location?: string;
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    // 1. Evento oficial de E-commerce GA4
    window.gtag("event", "begin_checkout", {
      currency,
      value: price,
      items: [
        {
          item_id: itemId,
          item_name: itemName,
          price,
          item_category: category,
          quantity: 1,
        },
      ],
      event_label: location,
    });

    // 2. Evento secundario de clic
    window.gtag("event", "comprar_ahora_click", {
      event_category: "conversion",
      event_label: location,
      item_id: itemId,
      price,
    });
  }
}

/**
 * Dispara evento oficial GA4 purchase en la página de agradecimiento
 */
export function trackPurchase({
  transactionId,
  value,
  currency = "USD",
  items,
}: {
  transactionId: string;
  value: number;
  currency?: string;
  items: EcomItem[];
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    // 1. GA4 purchase event
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value,
      currency,
      items: items.map((it) => ({
        ...it,
        quantity: it.quantity || 1,
      })),
    });

    // 2. Google Ads conversion
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/purchase`,
      value,
      currency,
      transaction_id: transactionId,
    });
  }
}

/**
 * Dispara evento oficial GA4 generate_lead cuando un visitante se registra para un recurso gratuito
 */
export function trackGenerateLead({
  leadType,
  location = "regalos_page",
}: {
  leadType: string;
  location?: string;
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      currency: "USD",
      value: 0,
      lead_type: leadType,
      event_label: location,
    });
  }
}

/**
 * Dispara evento de finalización del diagnóstico vocal con asignación de propiedad de usuario
 */
export function trackDiagnosticCompleted({
  archetypeName,
  archetypeId,
  score,
}: {
  archetypeName: string;
  archetypeId: string;
  score: number;
}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    // Evento de micro-conversión
    window.gtag("event", "diagnostic_completed", {
      archetype_name: archetypeName,
      archetype_id: archetypeId,
      score,
    });

    // Configura propiedad de usuario persistente en GA4
    window.gtag("set", "user_properties", {
      vocal_archetype: archetypeId,
      vocal_score: score,
    });
  }
}
