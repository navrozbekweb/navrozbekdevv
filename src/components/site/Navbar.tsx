/** Sticky top navigation for the landing page. */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, LogIn } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import ThemeToggle from "@/components/site/ThemeToggle";

const links = [
  { href: "#about", label: "Men haqimda" },
  { href: "#skills", label: "Ko'nikmalar" },
  { href: "#projects", label: "Loyihalar" },
  { href: "#contact", label: "Aloqa" },
];

export default function Navbar() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-sm font-bold tracking-tight uppercase">
          {content.about.name}
          <span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Murojaat
            </a>
          </li>
          <li>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              <LogIn size={14} />
              Kirish
            </Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="container-page flex flex-col gap-1 border-t border-border py-3 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogIn size={14} />
              Kirish
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
