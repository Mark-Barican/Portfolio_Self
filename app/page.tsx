import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

/**
 * Single-page portfolio. Each section is a self-contained module; ordering
 * mirrors the navigation and the resume's narrative (work → background → reach).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Certifications />
      <Contact />
    </>
  );
}
