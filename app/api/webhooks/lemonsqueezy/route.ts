import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/infrastructure/db/client";

// Define the expected Payload type from Lemon Squeezy (simplified)
interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data: {
      user_id?: string; // This is crucial
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      order_number?: number;
      user_email?: string;
      variant_id: number;
      product_id: number;
      status?: string; // e.g., "active", "cancelled"
      renews_at?: string;
      // ... other fields
    };
  };
}

// Map Lemon Squeezy Variant IDs to our Plans
// IMPORTANT: The USER must replace these numbers with their actual Variant IDs from Lemon Squeezy Dashboard
const PLAN_VARIANT_MAP: Record<string, string> = {
  // Example IDs - REPLACE THESE
  // "123456": "VOICE_WEEKLY", 
  // "234567": "STARTER", // Video Start (One-time or Sub?)
  // "345678": "PREMIUM", // Elite
  // "456789": "COACHING"
};

// Fallback: Map by Product Name if desired, but Variant ID is safer
const PLAN_NAME_MAP: Record<string, string> = {
  "Voz Semanal": "VOICE_WEEKLY",
  "Video Start": "STARTER", // Assume this gives credits but stays FREE or upgrades? 
  // Usually STARTER is a one-time thing in the pitch, but could be a plan. 
  // Based on checking usage logic, User.plan is "FREE" or "PREMIUM".
  // Video Start might just add credits.
  "Elite": "PREMIUM",
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmacHeader = req.headers.get("X-Signature");

    if (!hmacHeader) {
      return NextResponse.json({ error: "Missing Signature" }, { status: 400 });
    }

    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(hmacHeader, "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as LemonSqueezyWebhookPayload;
    const { event_name, custom_data } = payload.meta;
    const { attributes, id: subscriptionId } = payload.data;
    
    // We expect user_id in custom_data
    const userId = custom_data?.user_id;

    if (!userId) {
      console.warn("Webhook received without user_id in custom_data. Cannot associate with user.");
      // We process it anyway if we can find by customer_id or subscription_id later, 
      // but for 'subscription_created' we typically need userId.
    }

    console.log(`Received Lemon Squeezy event: ${event_name} for user: ${userId}`);

    // --- Handle Events ---

    // --- Helper to get product name safely ---
    // Lemon Squeezy payloads vary. We try to find the variant name or product name.
    // Usually in included resources or first_order_item attribute.
    // For simplicity without 'included' parsing, we might rely on Variant ID if known, 
    // BUT since we don't have IDs, we will try to infer or fallback.
    // CRITICAL: The best way without IDs is to trust the custom_data.plan_type if we sent it?
    // We didn't send plan_type in the checkout URL.
    
    // NEW STRATEGY: Look at the "meta" or "attributes" specifically.
    // The previous code was weak.
    
    // Let's implement a robust handler based on what we know:
    // We have "order_created" for Weekly.
    // We have "subscription_created" for Monthly.
    
    if (event_name === "subscription_created" || event_name === "subscription_updated" || event_name === "subscription_resumed") {
      await handleSubscriptionChange(userId, payload.data);
    } 
    else if (event_name === "subscription_cancelled" || event_name === "subscription_expired") {
      await handleSubscriptionCancellation(payload.data);
    }
    else if (event_name === "order_created") {
      await handleOrderCreated(userId, payload.data);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleSubscriptionChange(userId: string | undefined, data: any) {
  const attributes = data.attributes;
  const customerId = attributes.customer_id.toString();
  const subscriptionId = data.id.toString();
  const status = attributes.status; 
  const renewsAt = attributes.renews_at ? new Date(attributes.renews_at) : null;
  
  // 🔍 Detectar Plan por Nombre (Heurística MVP)
  // Lemon Squeezy envía 'variant_name' o 'product_name' en data.attributes (a veces requiere &include=product)
  // Asumimos que el payload incluye nombre o usamos defaults seguros.
  const productName = (attributes.product_name || attributes.variant_name || "").toLowerCase();
  
  let appPlan: "PREMIUM" | "VOICE_MONTHLY" | "STARTER" = "VOICE_MONTHLY";
  let creditsToAdd = 100;

  if (productName.includes("elite") || productName.includes("ejecutiva")) {
      appPlan = "PREMIUM";
      creditsToAdd = 250; // Soft cap mensual
  } else if (productName.includes("hábito") || productName.includes("mensual")) {
      appPlan = "VOICE_MONTHLY";
      creditsToAdd = 100;
  } else if (productName.includes("sprint") || productName.includes("semanal")) {
      appPlan = "STARTER"; // Usamos STARTER para el Sprint
      creditsToAdd = 70; // 70 por periodo
  }

  if (status === "active" || status === "on_trial") {
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: appPlan,
          // IMPORTANTE: En suscripción, reseteamos créditos o sumamos?
          // Modelos de suscripción suelen resetear o acumular.
          // Para evitar acumulación infinita de unused, reseteamos a la base + remanente?
          // Simplificación: Incrementamos (acumulativo) para no enfadar al usuario.
          credits: { increment: creditsToAdd }, 
          lemonSqueezyCustomerId: customerId,
          lemonSqueezySubscriptionId: subscriptionId,
          subscriptionStatus: status,
          subscriptionRenewsAt: renewsAt,
        }
      });
      console.log(`[WEBHOOK] User ${userId} subscribed to ${appPlan}. Added ${creditsToAdd} credits.`);
    } else {
        // Update by SubscriptionID (Renewal)
        const user = await prisma.user.findFirst({ where: { lemonSqueezySubscriptionId: subscriptionId } });
        if (user) {
             await prisma.user.update({
                where: { id: user.id },
                data: {
                    plan: appPlan, // Asegurar plan actualizado
                    subscriptionStatus: status,
                    subscriptionRenewsAt: renewsAt,
                    credits: { increment: creditsToAdd }
                }
             });
             console.log(`[WEBHOOK] Subscription renewed for user ${user.id} (${appPlan}). Added ${creditsToAdd} credits.`);
        }
    }
  }
}

async function handleSubscriptionCancellation(data: any) {
  const subscriptionId = data.id.toString();
  const status = data.attributes.status;
  
  // Just update status. Don't remove credits effectively paid for.
  await prisma.user.updateMany({
    where: { lemonSqueezySubscriptionId: subscriptionId },
    data: {
      subscriptionStatus: status,
      // We keep plan as is until it expires, logic handled by 'renewsAt' check in frontend potentially
      // or we just downgrade to FREE if status is 'expired'.
      plan: status === 'expired' ? 'FREE' : undefined
    }
  });
}

async function handleOrderCreated(userId: string | undefined, data: any) {
    const attributes = data.attributes;
    // Si es un "One Time Payment" (Sprint Semanal vendido como producto simple, no suscripción)
    
    // Asumimos Sprint Semanal es lo único "no-sub" o sub de corto plazo?
    // Si Sprint es sub semanal, caerá en handleSubscriptionChange.
    // Si es lifetime deal o pack de créditos:
    
    const credits = 70; // Default pack
    
    if (userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { increment: credits },
            }
        });
        console.log(`[WEBHOOK] User ${userId} bought One-Time Pack. Added ${credits} credits.`);
    }
}
