"use client";

import { motion, type Variants } from "framer-motion";
import { LuArrowDown, LuArrowUpRight, LuMapPin } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SITE } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-4xl flex-col gap-6"
        >
          {/* Availability pill */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Available for select freelance work
            </span>
          </motion.div>

          {/* Greeting */}
          <motion.p variants={item} className="text-base text-muted sm:text-lg">
            Hi, I&apos;m
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={item}
            className="text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-7xl md:text-8xl"
          >
            <span className="text-gradient">Mark Barican</span>
          </motion.h1>

          {/* Role */}
          <motion.p
            variants={item}
            className="text-2xl font-medium tracking-tight text-foreground/90 sm:text-3xl md:text-4xl"
          >
            Full-Stack Developer
          </motion.p>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg"
          >
            Building premium web experiences with modern technologies — from
            e-commerce and interactive 3D to full-stack systems, owned end to
            end.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button href="#projects" variant="primary" size="lg">
                View Projects
                <LuArrowUpRight
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  size={18}
                />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#contact" variant="secondary" size="lg">
                Contact
              </Button>
            </Magnetic>
          </motion.div>

          {/* Location */}
          <motion.div
            variants={item}
            className="mt-2 flex items-center gap-2 text-sm text-muted"
          >
            <LuMapPin size={15} className="text-accent" />
            {SITE.location}
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll cue */}
      <motion.a
        href="#projects"
        aria-label="Scroll to projects"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute inset-x-0 bottom-8 mx-auto hidden w-fit flex-col items-center gap-2 text-muted sm:flex"
      >
        <span className="text-[0.7rem] tracking-[0.25em] uppercase">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <LuArrowDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}
