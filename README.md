# Frontend Portfolio Builder

Build me a portfolio website for a Junior Frontend Developer. The entire project should be written in React + JSX, with a minimal and modern design (no excessive decorations, no childish colors — professional, black/white/gray based with a single accent color).

1. Landing Page (main page):

Hero section: name, title (Junior Frontend Developer), short intro text, and a photo/avatar

About Me section

Skills section — HTML, CSS, JavaScript, React, Git, etc., displayed as progress bars or an icon grid

Portfolio/Projects section — displayed as cards (image, title, description, technologies used, GitHub/demo link)

Contact section — a form (name, email, message) + social media links

Footer

The site must be fully responsive (mobile, tablet, desktop)

All data (skills, projects, about info) should be stored in local JS/JSON files (static/mock data) initially, but structured so it can later be edited through the admin panel

2. Admin Panel:

A separate /admin/login page with username and password fields

After logging in, redirect to /admin/dashboard

Authentication can be simple (using localStorage or Context API) — no backend required

The admin panel should allow managing:

Skills (add/edit/delete)

Projects (add/edit/delete — name, image, description, link)

About Me text editing

Contact information editing

All changes should be saved via localStorage and reflected on the Landing Page in real time

The admin page must be a protected route — only accessible after login; if not logged in, automatically redirect to the login page

Include a "Logout" button

3. Technical Requirements:

Fully built with React + JSX

Component-based structure (each section as a separate component)

Use React Router for page navigation (landing, admin/login, admin/dashboard)

Clean, well-organized, and commented code

Save the project as a GitHub repository and deploy it via Netlify or Vercel

Send me the following:

Live Netlify/Vercel link

GitHub repo link

Admin panel login username and password

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://navrozbekdev.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/623b3d47-8af5-4a91-960d-99a9ebb96403).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Lokal ishga tushirish (VS Code)

```sh
npm install
npm run dev
```

Admin panel: `/admin/login` — login: `admin`, parol: `admin404`

- Barcha kontent (about, ko'nikmalar, loyihalar, aloqa) `src/data/portfolio.ts` faylida statik saqlanadi;
  admin paneldagi o'zgarishlar brauzer xotirasiga (localStorage) yoziladi.
- Rasmlar `src/assets/` ichidagi fayllardan olinadi, shuning uchun lokal ishlatganda ham ko'rinadi.
- Ma'lumotlar bazasi faqat Lovable Cloud kalitlari (`.env`) mavjud bo'lganda ishlaydi.
  Lokal ishlatganda aloqa formasi baribir ishlaydi, lekin xabar bazaga saqlanmaydi.

### Telegram bildirishnomasi (lokal, Netlify, Vercel)

Aloqa formasidan kelgan xabarlar Telegram'ga yuborilishi uchun ikki qiymat kerak.
Lokalda `.env` fayliga, Netlify/Vercel'da esa loyiha sozlamalaridagi
"Environment variables" bo'limiga qo'shiladi:

```
TELEGRAM_BOT_TOKEN=<@BotFather bergan token>
TELEGRAM_CHAT_ID=7247424123
```

Token bo'lmasa forma xatolik bermaydi — xabar shunchaki yuborilmaydi.

