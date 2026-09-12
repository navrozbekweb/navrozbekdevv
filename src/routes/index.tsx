import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Projects from "@/components/site/Projects";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ğofurjonov Navrözbek — Junior Frontend Dasturchi Portfolio" },
      {
        name: "description",
        content:
          "Ğofurjonov Navrözbekning junior frontend dasturchi portfoliosi. React loyihalari, ko'nikmalar va aloqa ma'lumotlari.",
      },
      { property: "og:title", content: "Ğofurjonov Navrözbek — Junior Frontend Dasturchi" },
      {
        property: "og:description",
        content: "React loyihalari, ko'nikmalar va aloqa ma'lumotlari.",
      },
    ],
  }),
  component: Landing,
});

/** Landing page — each section is its own component. */
function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
