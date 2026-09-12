import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Kirish — Portfolio" },
      { name: "description", content: "Portfolio ma'lumotlarini boshqarish uchun kiring." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Kirish — Portfolio" },
      { property: "og:description", content: "Portfolio ma'lumotlarini boshqarish uchun kiring." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { logout, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Opening the login page always ends any existing session:
  // the password must be entered again to reach the dashboard.
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (await login(username, password)) {
      navigate({ to: "/admin/dashboard", replace: true });
    } else {
      setError("Foydalanuvchi nomi yoki parol noto'g'ri.");
    }
  }

  const field =
    "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <div className="mb-6 flex items-center gap-2">
          <Lock size={18} className="text-accent" />
          <h1 className="font-display text-xl font-bold">Admin kirish</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium">
              Foydalanuvchi nomi
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={field}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium">
              Parol
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Kirish
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-accent">
          ← Saytga qaytish
        </Link>
      </div>
    </div>
  );
}
