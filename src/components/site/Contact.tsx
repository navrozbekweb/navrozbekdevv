/** Contact section: message form saved to the database + contact details and socials. */
import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "@/context/ContentContext";
import { submitContactMessage } from "@/lib/content.functions";

function TelegramIcon({ size = 18 }: { size?: number }) {
  return <Send size={size} aria-hidden="true" />;
}

export default function Contact() {
  const { contact } = useContent().content;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      await submitContactMessage({ data: form });
      toast.success("Rahmat! Xabaringiz yuborildi.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Xabar yuborilmadi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

  return (
    <section id="contact" className="border-b border-border bg-surface py-16 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-2">
        <div>
          <p className="section-label">Aloqa</p>
          <h2 className="heading-xl mt-3 text-3xl sm:text-4xl">Birgalikda ishlaymiz</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Junior frontend lavozimlari, amaliyot o'rni va mustaqil loyihalar ochiq. Odatda bir kun ichida javob beraman.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-accent" />
              <a href={`mailto:${contact.email}`} className="hover:text-accent">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-accent" />
              <span>{contact.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-accent" />
              <span>{contact.location}</span>
            </li>
          </ul>

          <div className="mt-8 flex items-center gap-4 text-muted-foreground">
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
                <Github size={18} />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent">
                <Linkedin size={18} />
              </a>
            )}
            {contact.telegram && (
              <a href={contact.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="hover:text-accent">
                <TelegramIcon size={18} />
              </a>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium">
              Ism
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
              placeholder="Ismingiz"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
              placeholder="siz@kompaniya.uz"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-xs font-medium">
              Xabar
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${field} resize-y`}
              placeholder="Lavozim yoki loyiha haqida yozing…"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Yuborilmoqda…" : "Xabar yuborish"}
          </button>
        </form>
      </div>
    </section>
  );
}
