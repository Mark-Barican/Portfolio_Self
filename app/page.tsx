import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { WhatYouGet } from "@/components/sections/WhatYouGet";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/**
 * Single-page portfolio. Each section is a self-contained module; ordering
 * mirrors the navigation: story → proof → capabilities → person → reach.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Journey />
      <Projects />
      <Stack />
      <WhatYouGet />
      <About />
      <Contact />
    </>
  );
}
