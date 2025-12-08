export const runtime = "edge";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, amount, category } = body;

    if (!user_id || !amount || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Insertar en Neon usando Drizzle
    await db.insert(expenses).values({
      user_id,
      amount,
      category,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
