import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const today = new Date();
  const targetDay = today.getDate() + 5;

  if (targetDay > 31) {
    return NextResponse.json({ skipped: true });
  }

  const reminders = await sql`
    select email, due_day
    from reminders
    where due_day = ${targetDay};
  `;

  for (const r of reminders) {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: r.email,
      subject: "Recordatorio de tu tarjeta",
      html: `
        <p>Hola,</p>
        <p>Te avisamos con tiempo: tu tarjeta vence el día <strong>${r.due_day}</strong>.</p>
        <p>Así no tenés que pensar en esto después.</p>
        <p style="margin-top:24px;color:#666;font-size:12px">
          Oratoria Efectiva · Simple · Directo · Paz mental
        </p>
      `,
    });
  }

  return NextResponse.json({ sent: reminders.length });
}
