/** About me section. */
import { Check } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function About() {
  const { about } = useContent().content;

  return (
    <section id="about" className="border-b border-border py-16 md:py-24">
      <div className="container-page grid gap-10 md:grid-cols-[0.4fr_0.6fr]">
        <div>
          <p className="section-label">Men haqimda</p>
          <h2 className="heading-xl mt-3 text-3xl sm:text-4xl">Ozgina men haqimda</h2>
        </div>
        <div>
          <p className="text-base leading-relaxed text-muted-foreground">{about.bio}</p>
          <ul className="mt-8 space-y-3">
            {about.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm">
                <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
