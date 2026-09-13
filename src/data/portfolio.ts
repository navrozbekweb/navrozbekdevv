/**
 * Static/mock content for the portfolio.
 * This is the shape the admin panel edits and persists to the database.
 */
// Images are bundled from the repository so they also work when the project
// is downloaded and run locally (VS Code), not only on Lovable hosting.
import avatar from "@/assets/avatar-smile.png";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

/**
 * Older saved content may point at Lovable's CDN paths (/__l5e/...), which do
 * not exist outside Lovable hosting. Map those back to the bundled files.
 */
const localImages: Record<string, string> = {
  "avatar-smile.png": avatar,
  "project-1.jpg": project1,
  "project-2.jpg": project2,
  "project-3.jpg": project3,
};

export function resolveImage(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("/__l5e/")) {
    const file = url.split("/").pop() ?? "";
    return localImages[file] ?? url;
  }
  return url;
}

export type Skill = { id: string; name: string; level: number };

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  github: string;
  demo: string;
};

export type Contact = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  telegram: string;
};

export type About = {
  name: string;
  role: string;
  intro: string;
  avatar: string;
  bio: string;
  highlights: string[];
};

export type Content = {
  about: About;
  skills: Skill[];
  projects: Project[];
  contact: Contact;
};

export const defaultContent: Content = {
  about: {
    name: "Ğofurjonov Navrözbek",
    role: "Junior Frontend Dasturchi",
    intro:
      "Men React bilan toza, qulay va tez interfeyslar yarataman. Hozirga qadar birinchi to'liq stavkali frontend lavozimini qidirmoqdaman.",
    avatar,
    bio: "Najot Ta'lim'ning Frontend (React) yo'nalishi bitiruvchisiman. Asosan React va zamonaviy JavaScript texnologiyalarida ishlayman. O'qish va amaliyot davomida dashboard'lardan tortib internet-do'konlargacha turli interfeyslar yaratdim — moslashuvchanlik (responsive), foydalanish qulayligi (UX) hamda tezlikka alohida e'tibor qarataman. Dastlabki chizmalarni kengayuvchan komponentlar kutubxonasiga aylantirishni hamda boshqa dasturchilar oson o'qiy oladigan toza kod yozishni yoqtiraman.",
    highlights: [
      "8 oylik amaliy ta'lim davomida shakllangan React va JavaScript ko'nikmalari",
      "Git/GitHub versiya boshqaruvi bilan mustaqil loyihalar ustida ishlash",
      "Pixel-perfect layout hamda foydalanuvchi uchun qulay UI yaratishga e'tibor",
    ],
  },
  skills: [
    { id: "s1", name: "HTML5 va Semantika", level: 92 },
    { id: "s2", name: "CSS va Tailwind", level: 88 },
    { id: "s3", name: "JavaScript (ES2023)", level: 82 },
    { id: "s4", name: "React", level: 80 },
    { id: "s5", name: "Git va GitHub", level: 78 },
    { id: "s6", name: "TypeScript", level: 65 },
  ],
  projects: [
    {
      id: "p1",
      title: "Analitika Dashboardi",
      description:
        "Filterlanadigan diagrammalar, saqlangan ko'rinishlar va klaviatura navigatsiyasi bilan qorong'u rejimdagi analitika dashboardi.",
      image: project1,
      tech: ["React", "Recharts", "Tailwind"],
      github: "https://github.com/",
      demo: "https://example.com/",
    },
    {
      id: "p2",
      title: "Onlayn Do'kon Interfeysi",
      description:
        "Optimistik yangilanishlar bilan qayta ishlatiladigan komponentlar kutubxonasi sifatida yaratilgan mahsulotlar panjarasi, savat va to'lov oqimi.",
      image: project2,
      tech: ["React", "Zustand", "CSS Modules"],
      github: "https://github.com/",
      demo: "https://example.com/",
    },
    {
      id: "p3",
      title: "Ob-havo Hamrohi",
      description:
        "Ommaviy REST API dan foydalanuvchi, oflayn keshlash va geolokatsiya bilan mobil-first ob-havo ilovasi.",
      image: project3,
      tech: ["React", "REST API", "PWA"],
      github: "https://github.com/",
      demo: "https://example.com/",
    },
  ],
  contact: {
    email: "navrozbek404@gmail.com",
    phone: "+998 95 582 60 60",
    location: "Farg'ona, O'zbekiston",
    github: "https://github.com/navrozbekweb",
    linkedin: "https://www.linkedin.com/in/navrozbek-gofurjonov-79543b411/",
    telegram: "https://t.me/navrozbekc",
  },
};
