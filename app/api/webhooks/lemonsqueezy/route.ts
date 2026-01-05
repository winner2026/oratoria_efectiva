import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/infrastructure/db/client";

/**
 * Lemon Squeezy Webhook Handler
 * 
 * Este endpoint recibe notificaciones de pagos y suscripciones
 * y actualiza el plan del usuario en la base de datos automáticamente.
 */

const WEBHOOK_SECRET = "Vm@092021621";

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener el body raw para verificar la firma
    const rawBody = await req.text();
    
    // 2. Verificar la firma de Lemon Squeezy (Seguridad)
    const signature = req.headers.get("x-signature") || "";
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const checksum = Buffer.from(signature, "utf8");

    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
      console.error("[WEBHOOK] ❌ Firma inválida");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const body = payload.data;

    console.log(`[WEBHOOK] 📥 Evento recibido: ${eventName}`);

    // 3. Procesar según el tipo de evento
    
    // --- PEDIDO CREADO (Para Plan Starter de $9) ---
    if (eventName === "order_created") {
      const email = body.attributes.user_email;
      const variantId = body.attributes.variant_id; // Podríamos diferenciar por ID de variante
      
      console.log(`[WEBHOOK] ✅ Pedido completado para: ${email}`);
      
      // Actualizar a STARTER (o mejor PLAN segun el producto)
      // Como solo tenemos Starter y Premium, si el evento es order_created suele ser el Starter de $9
      await updatePlan(email, "STARTER");
    }

    // --- SUSCRIPCIÓN CREADA (Para Plan Premium de $29) ---
    if (eventName === "subscription_created") {
      const email = body.attributes.user_email;
      console.log(`[WEBHOOK] 💎 Suscripción Premium iniciada para: ${email}`);
      await updatePlan(email, "PREMIUM");
    }

    // --- SUSCRIPCIÓN CANCELADA O EXPIRADA ---
    if (eventName === "subscription_expired" || eventName === "subscription_cancelled") {
      const email = body.attributes.user_email;
      console.log(`[WEBHOOK] ⚠️ Suscripción finalizada para: ${email}`);
      await updatePlan(email, "FREE");
    }

    // --- PAGO EXITOSO (Renovación Mensual) ---
    if (eventName === "subscription_payment_success") {
       const email = body.attributes.user_email;
       console.log(`[WEBHOOK] ♻️ Renovación exitosa para: ${email}`);
       // Asegurar que sigue en PREMIUM y resetear créditos si fuera necesario
       await updatePlan(email, "PREMIUM");
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("[WEBHOOK] ❌ Error crítico:", error.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

/**
 * Función auxiliar para actualizar el plan en la base de datos
 */
async function updatePlan(email: string, plan: string) {
  try {
     console.log(`[DB_UPDATE] Intentando actualizar ${email} a ${plan}`);
     
     // 1. Actualizar en la tabla de User (si existe el registro)
     await db.query(
       `UPDATE "User" SET plan = $1 WHERE email = $2`,
       [plan, email]
     );

     // 2. Actualizar o Crear en la tabla de usage (que es la que controla los límites técnicos)
     // Usamos el email como user_id temporalmente si no tenemos el ID, 
     // pero lo ideal es que el usuario ya exista.
     await db.query(
       `UPDATE usage SET plan_type = $1 WHERE user_id IN (SELECT id FROM "User" WHERE email = $2)`,
       [plan, email]
     );

     console.log(`[DB_UPDATE] ✅ Usuario ${email} actualizado con éxito a ${plan}`);
  } catch (err) {
     console.error(`[DB_UPDATE] ❌ Error actualizando usuario ${email}:`, err);
  }
}
