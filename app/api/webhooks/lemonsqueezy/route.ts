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

    // 🛡️ REPLAY PROTECTION: Hash the body to create a unique Event ID
    const eventId = crypto.createHash('sha256').update(rawBody).digest('hex');
    
    // Check if we already processed this event
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId }
    });

    if (existingEvent) {
      console.log(`[WEBHOOK] Ignored duplicate event ${eventId}`);
      return NextResponse.json({ received: true, status: "already_processed" });
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
    
    // --- Handle Events ---

    if (event_name === "subscription_created" || event_name === "subscription_updated" || event_name === "subscription_resumed") {
      await handleSubscriptionChange(userId, payload.data);
    } 
    else if (event_name === "subscription_cancelled" || event_name === "subscription_expired") {
      await handleSubscriptionCancellation(payload.data);
    }
    // "order_created" is less relevant now as we shifted to subscriptions mostly, 
    // but could be used for one-time purchases if we had them. 
    // For now, we focus on subscription handling.

    // ✅ Log successful processing
    await prisma.webhookEvent.create({
      data: {
        eventId,
        provider: "lemon_squeezy",
        status: "success"
      }
    });

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
  
  // 🔍 Detect Plan by Name (Heuristic)
  const productName = (attributes.product_name || attributes.variant_name || "").toLowerCase();
  
  // Default to STARTER if unknown (safest non-free assumption)
  let appPlan: "STARTER" | "PREMIUM" = "STARTER";

  if (productName.includes("ejecutiva") || productName.includes("elite") || productName.includes("premium")) {
      appPlan = "PREMIUM";
  } else {
      // Covers "Hábito", "Sprint", "Mensual", "Starter"
      appPlan = "STARTER"; 
  }

  if (status === "active" || status === "on_trial") {
    
    // We need a user ID. If not in custom_data, try to find by subscriptionId.
    let targetUserId = userId;

    if (!targetUserId) {
        // 📧 FALLBACK: Find by email if user_id is missing (e.g. bought from direct link)
        const customerEmail = attributes.user_email;
        if (customerEmail) {
            const userByEmail = await prisma.user.findUnique({ where: { email: customerEmail } });
            targetUserId = userByEmail?.id;
        }

        // 🔍 EXTENDED FALLBACK: Find by existing subscription ID
        if (!targetUserId) {
            const existingUser = await prisma.user.findFirst({ 
                where: { lemonSqueezySubscriptionId: subscriptionId } 
            });
            targetUserId = existingUser?.id;
        }
    }

    // 🚀 UPSERT Strategy: Update if exists, Create if new 
    // This handles the "Ghost User" case (bought before ever entering the app)
    const customerEmail = attributes.user_email;
    
    // We only proceed if we have a way to identify the user (ID or Email)
    if (targetUserId || customerEmail) {
      await prisma.user.upsert({
        where: targetUserId ? { id: targetUserId } : { email: customerEmail },
        update: {
          plan: appPlan,
          lemonSqueezyCustomerId: customerId,
          lemonSqueezySubscriptionId: subscriptionId,
          subscriptionStatus: status,
          subscriptionRenewsAt: renewsAt,
        },
        create: {
          email: customerEmail,
          name: attributes.user_name || "Miembro Pro",
          plan: appPlan,
          lemonSqueezyCustomerId: customerId,
          lemonSqueezySubscriptionId: subscriptionId,
          subscriptionStatus: status,
          subscriptionRenewsAt: renewsAt,
        }
      });

      // Update targetUserId after upsert to ensure usage sync
      const finalUser = await prisma.user.findUnique({ where: { email: customerEmail }});
      if (!finalUser) return;
      targetUserId = finalUser.id;

      // 2. Update Usage Record (Reset Monthly Limits if it's a new cycle)
      // We check if we need to reset based on `renewsAt` or just doing an upsert.
      // Easiest robust way: Upsert Usage record ensuring planType is synced.
      // If it's a renewal (subscription_updated), typically "renews_at" changes.
      // Ideally, the system resets usage when `checkUsage` sees a new month.
      // But updating planType here is crucial.
      
      const usage = await prisma.usage.findUnique({ where: { userId: targetUserId }});
      
      if (!usage) {
          await prisma.usage.create({
              data: {
                  userId: targetUserId,
                  fingerprint: targetUserId, // Fallback
                  planType: appPlan,
                  monthStart: new Date(),
                  monthlyAnalyses: 0
              }
          });
      } else {
          await prisma.usage.update({
              where: { userId: targetUserId },
              data: {
                  planType: appPlan,
                  // We don't necessarily reset usage here because "subscription_updated" 
                  // might happen for other reasons. checkUsage handles monthly reset based on dates.
                  // However, if upgrading plan, user might expect instant access? 
                  // Let's rely on CheckUsage logic for resetting.
              }
          });
      }

      console.log(`[WEBHOOK] User ${targetUserId} updated to ${appPlan}. Status: ${status}`);
    } else {
        console.warn(`[WEBHOOK] Could not find user for subscription update. SubID: ${subscriptionId}`);
    }
  }
}

async function handleSubscriptionCancellation(data: any) {
  const subscriptionId = data.id.toString();
  const status = data.attributes.status;
  
  await prisma.user.updateMany({
    where: { lemonSqueezySubscriptionId: subscriptionId },
    data: {
      subscriptionStatus: status,
      // If expired, downgrade to FREE
      plan: status === 'expired' ? 'FREE' : undefined
    }
  });

  // Downgrade usage planType if expired
  if (status === 'expired') {
      const user = await prisma.user.findFirst({ where: { lemonSqueezySubscriptionId: subscriptionId }});
      if (user) {
          await prisma.usage.update({
              where: { userId: user.id },
              data: { planType: 'FREE' }
          });
      }
  }
}

