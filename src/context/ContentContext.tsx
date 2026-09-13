/**
 * Content store.
 * Holds all editable site data (about, skills, projects, contact).
 * Content is loaded from the database (shared across all visitors) and
 * admin edits are saved back to it, so they survive page reloads.
 * localStorage is only a fast local cache for instant rendering.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, resolveImage, type Content } from "@/data/portfolio";
import { saveSiteContent } from "@/lib/content.functions";
import { TOKEN_KEY } from "@/context/AuthContext";

const STORAGE_KEY = "portfolio:content";

type Ctx = {
  content: Content;
  update: (patch: Partial<Content>) => void;
  reset: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

/** Make sure image paths work both on Lovable and in a local run. */
function normalize(content: Content): Content {
  return {
    ...content,
    about: { ...content.about, avatar: resolveImage(content.about?.avatar) },
    projects: (content.projects ?? []).map((p) => ({ ...p, image: resolveImage(p.image) })),
  };
}

function readCached(): Content | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Content>;
    return normalize({ ...defaultContent, ...parsed });
  } catch {
    return null;
  }
}

function cacheContent(content: Content) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  // Start from defaults so server and client render the same markup.
  const [content, setContent] = useState<Content>(defaultContent);

  useEffect(() => {
    // Instant paint from the local cache, then the database wins.
    const cached = readCached();
    if (cached) setContent(cached);

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("data")
          .eq("key", "main")
          .maybeSingle();
        if (!cancelled && !error && data?.data) {
          const merged = normalize({ ...defaultContent, ...(data.data as Partial<Content>) });
          setContent(merged);
          cacheContent(merged);
        }
      } catch {
        /* offline — keep cached/default content */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<Content>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      cacheContent(next);
      // Persist to the database so the change survives reloads and is
      // visible to every visitor. Requires an active admin session.
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (token) {
        saveSiteContent({ data: { token, content: next } }).catch(() => {
          toast.error("Saqlashda xatolik — qaytadan kiring");
        });
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setContent(defaultContent);
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      saveSiteContent({ data: { token, content: defaultContent } }).catch(() => {
        toast.error("Saqlashda xatolik — qaytadan kiring");
      });
    }
  }, []);

  const value = useMemo(() => ({ content, update, reset }), [content, update, reset]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
