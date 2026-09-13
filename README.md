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


