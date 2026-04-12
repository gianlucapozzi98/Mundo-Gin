import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Dati mancanti." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "mail.mundogin.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || "info@mundogin.com";
    const pass = process.env.SMTP_PASS;

    if (!pass) {
      return NextResponse.json(
        { ok: false, error: "SMTP non configurato (manca password)." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 SSL, 587 STARTTLS
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Mundo Gin" <info@mundogin.com>`,
      to: "info@mundogin.com",
      replyTo: email,
      subject: "Nuova richiesta dal form contatti",
      text: `
Nuova richiesta dal sito Mundo Gin

Nome: ${name}
Email: ${email}
Telefono: ${phone || "-"}

Messaggio:
${message}
      `.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Errore invio email contatti:", error);
    return NextResponse.json(
      { ok: false, error: "Errore invio email." },
      { status: 500 }
    );
  }
}

