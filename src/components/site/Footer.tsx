/** Site footer. */
import { Link } from "@tanstack/react-router";
import { useContent } from "@/context/ContentContext";

export default function Footer() {
  const { about } = useContent().content;
  const year = new Date().getFullYear();

  return (
    <footer className="py-10">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {year} {about.name}. React yordamida yaratildi.
        </p>
        <Link to="/admin/login" className="hover:text-accent">
          Admin
        </Link>
      </div>
    </footer>
  );
}
