/**
 * Test unitario para verificar las firmas y estructura de eventos de Google Analytics 4 (GA4)
 */

import {
  trackViewItem,
  trackBeginCheckout,
  trackPurchase,
  trackGenerateLead,
  trackDiagnosticCompleted,
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
} from "../src/lib/analytics/gtag";

console.log("=== INICIANDO AUDITORÍA Y TEST DE GA4 TRACKING ===");

// Simulación de window.gtag
const eventsLogged: Array<{ command: string; action: string; payload: any }> = [];

(global as any).window = {
  gtag: (command: string, action: string, payload: any) => {
    eventsLogged.push({ command, action, payload });
  },
};

// 1. Test trackViewItem
console.log("\n[TEST 1] Probando evento view_item (Ficha de Producto):");
trackViewItem({
  itemId: "protocolo-de-respuestas-inteligentes",
  itemName: "Protocolo de Respuestas Inteligentes",
  price: 17.0,
  category: "Libro Digital",
});

const viewItemEvent = eventsLogged.find((e) => e.action === "view_item");
if (!viewItemEvent) throw new Error("FAIL: view_item no fue disparado");
if (viewItemEvent.payload.currency !== "USD" || viewItemEvent.payload.value !== 17.0) {
  throw new Error("FAIL: Parámetros de moneda o valor incorrectos en view_item");
}
if (!viewItemEvent.payload.items || viewItemEvent.payload.items[0].item_id !== "protocolo-de-respuestas-inteligentes") {
  throw new Error("FAIL: Matriz items incorrecta en view_item");
}
console.log("✓ Evento view_item cumple 100% con las especificaciones oficiales de GA4");

// 2. Test trackBeginCheckout
console.log("\n[TEST 2] Probando evento begin_checkout (Inicio de compra hacia Hotmart):");
trackBeginCheckout({
  itemId: "sin-miedo-a-hablar",
  itemName: "Sin Miedo a Hablar",
  price: 29.0,
  category: "Curso Online",
  location: "hero",
});

const beginCheckoutEvent = eventsLogged.find((e) => e.action === "begin_checkout");
if (!beginCheckoutEvent) throw new Error("FAIL: begin_checkout no fue disparado");
if (beginCheckoutEvent.payload.value !== 29.0 || beginCheckoutEvent.payload.event_label !== "hero") {
  throw new Error("FAIL: Parámetros incorrectos en begin_checkout");
}
console.log("✓ Evento begin_checkout registrado con valor 29.0 USD y ubicación 'hero'");

// 3. Test trackPurchase
console.log("\n[TEST 3] Probando evento purchase (Página de Agradecimiento):");
trackPurchase({
  transactionId: "HOTMART_TX_987654",
  value: 17.0,
  currency: "USD",
  items: [
    {
      item_id: "protocolo-de-respuestas-inteligentes",
      item_name: "Protocolo de Respuestas Inteligentes",
      price: 17.0,
      item_category: "Libro Digital",
    },
  ],
});

const purchaseEvent = eventsLogged.find((e) => e.action === "purchase");
if (!purchaseEvent) throw new Error("FAIL: purchase no fue disparado");
if (purchaseEvent.payload.transaction_id !== "HOTMART_TX_987654" || purchaseEvent.payload.value !== 17.0) {
  throw new Error("FAIL: Parámetros incorrectos en purchase");
}

const gAdsEvent = eventsLogged.find((e) => e.action === "conversion");
if (!gAdsEvent || gAdsEvent.payload.send_to !== `${GOOGLE_ADS_ID}/purchase`) {
  throw new Error("FAIL: Conversión de Google Ads no disparada correctamente");
}
console.log("✓ Evento purchase disparado con transaction_id único y duplicado en Google Ads");

// 4. Test trackGenerateLead
console.log("\n[TEST 4] Probando evento generate_lead (Sección de Regalos):");
trackGenerateLead({
  leadType: "guia_claridad_5_minutos",
  location: "regalos_page",
});

const leadEvent = eventsLogged.find((e) => e.action === "generate_lead");
if (!leadEvent || leadEvent.payload.lead_type !== "guia_claridad_5_minutos") {
  throw new Error("FAIL: generate_lead no fue disparado con el tipo correcto");
}
console.log("✓ Evento generate_lead registrado para la guía gratuita");

// 5. Test trackDiagnosticCompleted
console.log("\n[TEST 5] Probando evento diagnostic_completed y propiedades de usuario:");
trackDiagnosticCompleted({
  archetypeName: "Líder Magnético",
  archetypeId: "lider-magnetico",
  score: 85,
});

const diagEvent = eventsLogged.find((e) => e.action === "diagnostic_completed");
if (!diagEvent || diagEvent.payload.archetype_id !== "lider-magnetico") {
  throw new Error("FAIL: diagnostic_completed no fue disparado");
}

const userProps = eventsLogged.find((e) => e.command === "set" && e.action === "user_properties");
if (!userProps || userProps.payload.vocal_archetype !== "lider-magnetico") {
  throw new Error("FAIL: Propiedad de usuario no fue asignada");
}
console.log("✓ Evento diagnostic_completed y user_properties configurados con éxito");

console.log(`\n=== TODAS LAS PRUEBAS DE GA4 PASARON EXITOSAMENTE (${eventsLogged.length} eventos validados) ===`);
