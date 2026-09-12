/** Skills section, rendered as labelled progress bars. */
import { useContent } from "@/context/ContentContext";

export default function Skills() {
  const { skills } = useContent().content;

  return (
    <section id="skills" className="border-b border-border bg-surface py-16 md:py-24">
      <div className="container-page">
        <p className="section-label">Ko'nikmalar</p>
        <h2 className="heading-xl mt-3 text-3xl sm:text-4xl">Nima bilan ishlayman</h2>

        <div className="mt-10 grid gap-x-12 gap-y-7 sm:grid-cols-2">
          {skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="font-display text-xs text-muted-foreground">{skill.level}%</span>
              </div>
              <div
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-label={skill.name}
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
