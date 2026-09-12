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
const DEFAULT_ADMIN = { username: "admin", password: "portfolio2026" };

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

const IMAGE_BUCKET = "site-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/** Admin: upload an image file (from the dashboard) to Supabase Storage and return its public URL. */
export const uploadSiteImage = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; filename: string; contentType: string; base64: string }) => data)
  .handler(async ({ data }) => {
    if (!data.token || !verifyToken(data.token)) {
      throw new Response("Unauthorized", { status: 401 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(data.contentType)) {
      throw new Error("Faqat JPG, PNG, WEBP yoki GIF rasm fayllari qabul qilinadi");
    }
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("Rasm hajmi 5 MB dan oshmasligi kerak");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Make sure the public bucket exists (no-op if it's already there).
    await supabaseAdmin.storage.createBucket(IMAGE_BUCKET, { public: true }).catch(() => {});

    const ext = data.filename.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(IMAGE_BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (uploadError) throw new Error("Rasm yuklashda xatolik yuz berdi");

    const { data: pub } = supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    return { ok: true as const, url: pub.publicUrl };
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert(data);
    if (error) throw new Error("Xabarni saqlashda xatolik");
    await notifyTelegram(data);
    return { ok: true as const };
  });

/**
 * Telegram bildirishnomasi: yangi xabarni egasining Telegram chatiga yuboradi.
 * To'g'ridan-to'g'ri Telegram Bot API (api.telegram.org) orqali ishlaydi —
 * BotFather'dan olingan TELEGRAM_BOT_TOKEN kerak (Lovable'ning ichki connectoriga bog'liq emas).
 */
async function notifyTelegram(data: { name: string; email: string; message: string }) {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"] || TELEGRAM_CHAT_ID;
  if (!botToken) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN sozlanmagan — xabar Telegram'ga yuborilmadi.");
    return;
  }
  const text =
    `🔔 Yangi xabar (portfolio)\n\n` +
    `👤 ${data.name}\n` +
    `✉️ ${data.email}\n\n` +
    data.message;
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error(`[telegram] sendMessage failed [${res.status}]: ${await res.text()}`);
    }
  } catch (e) {
    console.error("[telegram] sendMessage error", e);
  }
}
