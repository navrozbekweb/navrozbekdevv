/** Hero: name, role, intro and avatar. */
import { ArrowDown, Github, Mail, Send } from "lucide-react";
import { useContent } from "@/context/ContentContext";

function TelegramIcon({ size = 18 }: { size?: number }) {
  return <Send size={size} aria-hidden="true" />;
}

export default function Hero() {
  const { content } = useContent();
  const { about, contact } = content;

  return (
    <section id="top" className="border-b border-border">
      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-28">
        <div>
          <p className="section-label">{about.role}</p>
          <h1 className="heading-xl mt-4 text-5xl sm:text-6xl lg:text-7xl">
            {about.name}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ishlarimni ko'rish <ArrowDown size={16} />
            </a>
            <a
              href="#contact"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Bog'lanish
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4 text-muted-foreground">
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
                <Github size={18} />
              </a>
            )}
            {contact.telegram && (
              <a href={contact.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="hover:text-accent">
                <TelegramIcon size={18} />
              </a>
            )}
            <a href={`mailto:${contact.email}`} aria-label="Email" className="hover:text-accent">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs md:max-w-none">
          <div className="absolute -inset-3 -z-10 rounded-lg border border-accent/40" aria-hidden="true" />
          <img
            src={about.avatar}
            alt={`${about.name}, ${about.role}`}
            width={816}
            height={816}
            className="aspect-square w-full rounded-lg object-cover grayscale"
          />
        </div>
      </div>
    </section>
  );
}
