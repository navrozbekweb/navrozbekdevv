/**
 * Server functions for the portfolio admin panel.
 * Login verifies the admin password server-side and returns a session token;
 * saving content requires that token. Reading content is public.
 */
import { createServerFn } from "@tanstack/react-start";
import { createHmac, timingSafeEqual } from "crypto";
import type { Json } from "@/integrations/supabase/types";

const CONTENT_KEY = "main";
// Yangi xabarlar shu Telegram chatiga yuboriladi.
const TELEGRAM_CHAT_ID = "7247424123";
// Default matches the demo credentials; override with the ADMIN_PASSWORD secret.
const DEFAULT_ADMIN = { username: "admin", password: "admin404" };

function adminPassword(): string {
  return process.env["ADMIN_PASSWORD"] || DEFAULT_ADMIN.password;
}

function makeToken(): string {
  return createHmac("sha256", adminPassword())
    .update("portfolio-admin-session")
    .digest("hex");
}

function verifyToken(token: string): boolean {
  const expected = makeToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const ok =
      data.username.trim() === DEFAULT_ADMIN.username &&
      data.password === adminPassword();
    if (!ok) return { ok: false as const };
    return { ok: true as const, token: makeToken() };
  });

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; content: unknown }) => data)
  .handler(async ({ data }) => {
    if (!data.token || !verifyToken(data.token)) {
      throw new Response("Unauthorized", { status: 401 });
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(
        { key: CONTENT_KEY, data: data.content as unknown as Json, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );
    if (error) throw new Error("Saqlashda xatolik yuz berdi");
    return { ok: true as const };
  });

/** Public: store a contact form message in the database. */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; email: string; message: string }) => {
    const name = String(data.name || "").trim().slice(0, 120);
    const email = String(data.email || "").trim().slice(0, 200);
    const message = String(data.message || "").trim().slice(0, 5000);
    if (!name || !email.includes("@") || !message) throw new Error("Ma'lumotlar to'liq emas");
    return { name, email, message };
  })
  .handler(async ({ data }) => {
    // Saving and Telegram both need backend keys. When the project runs
    // locally without them, the form still works (message is only logged).
    if (process.env["SUPABASE_SERVICE_ROLE_KEY"] && process.env["SUPABASE_URL"]) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("contact_messages").insert(data);
        if (error) console.error("[contact] save failed", error.message);
      } catch (e) {
        console.error("[contact] save error", e);
      }
    } else {
      console.info("[contact] local mode — message not stored:", data.name, data.email);
    }
    await notifyTelegram(data);
    return { ok: true as const };
  });

/**
 * Telegram bildirishnomasi: yangi xabarni egasining Telegram chatiga yuboradi.
 * 1) TELEGRAM_BOT_TOKEN bo'lsa — to'g'ridan-to'g'ri Telegram API (Netlify/Vercel/local).
 * 2) Aks holda — Lovable connector gateway (faqat Lovable hostingida).
 */
async function notifyTelegram(data: { name: string; email: string; message: string }) {
  const chatId = process.env["TELEGRAM_CHAT_ID"] || TELEGRAM_CHAT_ID;
  const text =
    `🔔 Yangi xabar (portfolio)\n\n` +
    `👤 ${data.name}\n` +
    `✉️ ${data.email}\n\n` +
    data.message;

  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  if (botToken) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (!res.ok) {
        console.error(`[telegram] direct sendMessage failed [${res.status}]: ${await res.text()}`);
        return;
      }
      return;
    } catch (e) {
      console.error("[telegram] direct sendMessage error", e);
      return;
    }
  }

  const lovableKey = process.env["LOVABLE_API_KEY"];
  const telegramKey = process.env["TELEGRAM_API_KEY"];
  if (!lovableKey || !telegramKey) {
    console.info("[telegram] no credentials — notification skipped");
    return;
  }
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": telegramKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error(`[telegram] sendMessage failed [${res.status}]: ${await res.text()}`);
    }
  } catch (e) {
    console.error("[telegram] sendMessage error", e);
  }
}

