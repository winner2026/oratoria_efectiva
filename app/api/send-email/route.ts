import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, dueDay } = await req.json();

  if (!email || !dueDay) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: "Te avisamos a tiempo",
      html: `
        <p>Hola,</p>
        <p>Te recordamos que tu tarjeta vence el día <strong>${dueDay}</strong>.</p>
        <p>Pagar el total hoy te evita pensar en esto después.</p>
        <p style="margin-top:24px;color:#666;font-size:12px">
          Oratoria Efectiva · Simple · Directo · Paz mental
        </p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
