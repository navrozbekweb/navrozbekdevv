import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import type { Project, Skill } from "@/data/portfolio";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Panel — Portfolio" },
      { name: "description", content: "Ko'nikmalar, loyihalar, men haqimda matni va aloqa ma'lumotlarini boshqarish." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel — Portfolio" },
      { property: "og:description", content: "Portfolio ma'lumotlarini boshqarish." },
    ],
  }),
  component: Dashboard,
});

const field =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent";
const tabs = ["Ko'nikmalar", "Loyihalar", "Men haqimda", "Aloqa"] as const;
type Tab = (typeof tabs)[number];

/** Protected admin dashboard. Redirects to /admin/login when signed out. */
function Dashboard() {
  const { isAuthed, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Ko'nikmalar");

  useEffect(() => {
    if (ready && !isAuthed) navigate({ to: "/admin/login", replace: true });
  }, [ready, isAuthed, navigate]);

  if (!ready || !isAuthed) return null;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <h1 className="font-display text-sm font-bold uppercase tracking-tight">
            Admin<span className="text-accent">.</span>
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-accent">
              Saytni ko'rish
            </Link>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/admin/login", replace: true });
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:bg-muted"
            >
              <LogOut size={15} /> Chiqish
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <nav className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        {tab === "Ko'nikmalar" && <SkillsPanel />}
        {tab === "Loyihalar" && <ProjectsPanel />}
        {tab === "Men haqimda" && <AboutPanel />}
        {tab === "Aloqa" && <ContactPanel />}

        <ResetButton />
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-card p-5">{children}</div>;
}

/* ---------------- Skills: add / edit / delete ---------------- */
function SkillsPanel() {
  const { content, update } = useContent();

  const save = (skills: Skill[]) => update({ skills });

  return (
    <div className="space-y-4">
      {content.skills.map((s, i) => (
        <Card key={s.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium">Ko'nikma</label>
              <input
                className={field}
                value={s.name}
                onChange={(e) => {
                  const next = [...content.skills];
                  next[i] = { ...s, name: e.target.value };
                  save(next);
                }}
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="mb-1.5 block text-xs font-medium">Daraja %</label>
              <input
                type="number"
                min={0}
                max={100}
                className={field}
                value={s.level}
                onChange={(e) => {
                  const next = [...content.skills];
                  next[i] = { ...s, level: Number(e.target.value) };
                  save(next);
                }}
              />
            </div>
            <button
              onClick={() => {
                save(content.skills.filter((x) => x.id !== s.id));
                toast.success("Ko'nikma o'chirildi");
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-muted"
            >
              <Trash2 size={15} /> O'chirish
            </button>
          </div>
        </Card>
      ))}

      <button
        onClick={() =>
          save([...content.skills, { id: crypto.randomUUID(), name: "Yangi ko'nikma", level: 50 }])
        }
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Plus size={16} /> Ko'nikma qo'shish
      </button>
    </div>
  );
}

/* ---------------- Projects: add / edit / delete ---------------- */
function ProjectsPanel() {
  const { content, update } = useContent();
  const save = (projects: Project[]) => update({ projects });

  const patch = (i: number, p: Partial<Project>) => {
    const next = [...content.projects];
    next[i] = { ...(content.projects[i] as Project), ...p };
    save(next);
  };

  return (
    <div className="space-y-4">
      {content.projects.map((p, i) => (
        <Card key={p.id}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium">Sarlavha</label>
              <input className={field} value={p.title} onChange={(e) => patch(i, { title: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Rasm URL</label>
              <input className={field} value={p.image} onChange={(e) => patch(i, { image: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium">Tavsif</label>
              <textarea
                rows={3}
                className={field}
                value={p.description}
                onChange={(e) => patch(i, { description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium">Texnologiyalar (vergul bilan ajrating)</label>
              <input
                className={field}
                value={p.tech.join(", ")}
                onChange={(e) =>
                  patch(i, { tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">GitHub havolasi</label>
              <input className={field} value={p.github} onChange={(e) => patch(i, { github: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">Demo havolasi</label>
              <input className={field} value={p.demo} onChange={(e) => patch(i, { demo: e.target.value })} />
            </div>
          </div>
          <button
            onClick={() => {
              save(content.projects.filter((x) => x.id !== p.id));
              toast.success("Loyiha o'chirildi");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-muted"
          >
            <Trash2 size={15} /> Loyihani o'chirish
          </button>
        </Card>
      ))}

      <button
        onClick={() =>
          save([
            ...content.projects,
            {
              id: crypto.randomUUID(),
              title: "Yangi loyiha",
              description: "Loyihaning qisqacha tavsifi.",
              image: "https://placehold.co/1200x800?text=Loyiha",
              tech: ["React"],
              github: "",
              demo: "",
            },
          ])
        }
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Plus size={16} /> Loyiha qo'shish
      </button>
    </div>
  );
}

/* ---------------- About text ---------------- */
function AboutPanel() {
  const { content, update } = useContent();
  const a = content.about;
  const patch = (p: Partial<typeof a>) => update({ about: { ...a, ...p } });

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium">Ism</label>
          <input className={field} value={a.name} onChange={(e) => patch({ name: e.target.value })} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium">Lavozim / yo'nalish</label>
          <input className={field} value={a.role} onChange={(e) => patch({ role: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium">Rasm URL</label>
          <input className={field} value={a.avatar} onChange={(e) => patch({ avatar: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium">Kirish matni</label>
          <textarea rows={2} className={field} value={a.intro} onChange={(e) => patch({ intro: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium">Men haqimda matni</label>
          <textarea rows={6} className={field} value={a.bio} onChange={(e) => patch({ bio: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium">Yutuqlar (har qatorda bittadan)</label>
          <textarea
            rows={4}
            className={field}
            value={a.highlights.join("\n")}
            onChange={(e) => patch({ highlights: e.target.value.split("\n").filter(Boolean) })}
          />
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Contact info ---------------- */
function ContactPanel() {
  const { content, update } = useContent();
  const c = content.contact;
  const patch = (p: Partial<typeof c>) => update({ contact: { ...c, ...p } });

  const rows: { key: keyof typeof c; label: string }[] = [
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefon" },
    { key: "location", label: "Manzil" },
    { key: "github", label: "GitHub havolasi" },
    { key: "linkedin", label: "LinkedIn havolasi" },
    { key: "telegram", label: "Telegram havolasi" },
  ];

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.key}>
            <label className="mb-1.5 block text-xs font-medium">{r.label}</label>
            <input
              className={field}
              value={c[r.key]}
              onChange={(e) => patch({ [r.key]: e.target.value } as Partial<typeof c>)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Restores the original static data. */
function ResetButton() {
  const { reset } = useContent();
  return (
    <button
      onClick={() => {
        reset();
        toast.success("Ma'lumotlar asl holatiga qaytarildi");
      }}
      className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-accent"
    >
      <RotateCcw size={14} /> Barcha ma'lumotlarni asl holatiga qaytarish
    </button>
  );
}
