/** Kunduzgi / tungi rejim tugmasi. Tanlov brauzer xotirasida saqlanadi. */
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  // Read the stored choice after hydration to avoid SSR mismatches.
  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const prefers =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefers);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark, ready]);

  return (
    <button
      type="button"
      onClick={() => setDark((v) => !v)}
      aria-label={dark ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"}
      title={dark ? "Kunduzgi rejim" : "Tungi rejim"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground ${className}`}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
