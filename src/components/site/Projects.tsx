/** Projects section: card grid with image, tech tags and links. */
import { ExternalLink, Github } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function Projects() {
  const { projects } = useContent().content;

  return (
    <section id="projects" className="border-b border-border py-16 md:py-24">
      <div className="container-page">
        <p className="section-label">Portfolio</p>
        <h2 className="heading-xl mt-3 text-3xl sm:text-4xl">Tanlangan loyihalar</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent"
            >
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center gap-4 text-sm">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent"
                    >
                  <Github size={15} /> Kod
                </a>
              )}
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent"
                >
                  <ExternalLink size={15} /> Demo
                </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
