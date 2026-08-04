import {
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sprout,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { MouseEvent, ReactNode, useRef, useState } from "react";

const navLinks = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const roleTags = ["Environmental Scientist", "Field Researcher", "Developer"];

const skillGroups = [
  {
    title: "Assessment",
    skills: [
      "Phase I & II ESA",
      "Brownfield assessment",
      "HHRA",
      "Conceptual site model (CSM)",
      "Site delineation",
      "Environmental reporting",
    ],
  },
  {
    title: "Regulatory Risk",
    skills: [
      "BC CSR",
      "CCME guidelines",
      "Hazard quotient",
      "Spatial risk mapping",
      "WHMIS",
      "Transportation of Dangerous Goods (TDG)",
    ],
  },
  {
    title: "GIS and Data",
    skills: [
      "Buffer analysis",
      "Overlay analysis",
      "Historical aerial imagery interpretation",
      "ArcGIS Survey123",
      "RStudio (Ricker modelling, QA/QC)",
      "Excel (KPI dashboards)",
    ],
  },
  {
    title: "Field Ecology",
    skills: [
      "Invasive species identification",
      "Field monitoring",
      "Habitat recovery tracking",
      "Native/invasive plant ID",
    ],
  },
];

const projects = [
  {
    title: "BC CSR Tool",
    eyebrow: "Featured",
    period: "Live at bccsrtool.ca",
    stack: ["HTML/CSS/JS", "GitHub", "BC CSR Schedule 3.1"],
    href: "https://bccsrtool.ca",
    summary:
      "A focused web tool that streamlines Phase I & II ESA workflows through contaminant threshold logic for soil and groundwater pathways.",
    details: [
      "Implements CSR threshold logic for contaminant comparison against BC standards.",
      "Includes a Phase II data input module for comparing field results against CSR standards.",
      "Built for faster environmental screening, reporting, and defensible early assessment.",
    ],
    featured: true,
  },
  {
    title: "Phase I ESA & Brownfield Redevelopment",
    eyebrow: "Environmental Assessment",
    period: "Jan-Apr 2026",
    stack: ["BC CSR", "Historical imagery", "CSM", "Risk map"],
    summary:
      "Phase I ESA for a residential condo redevelopment with APEC identification and a source-pathway-receptor model.",
    details: [
      "Identified 3 APECs using historical aerial imagery interpretation.",
      "Built a conceptual site model and spatial risk map for redevelopment planning.",
    ],
  },
  {
    title: "Salmon Dam Modelling",
    eyebrow: "Quantitative Ecology",
    period: "Sep-Dec 2025",
    stack: ["RStudio", "Ricker Model", "QA/QC", "MSY"],
    summary:
      "Cleaned 40 years of Pacific salmon data and modelled population response across dam and habitat scenarios.",
    details: [
      "Ran 5 dam scenarios across 5 habitat effect levels.",
      "Produced quantitative maximum sustainable yield predictions.",
    ],
  },
];

const experience = [
  {
    title: "Environmental Restoration Technician",
    org: "Stanley Park Ecology Society (DIRT)",
    type: "Volunteer",
    place: "Vancouver, BC",
    dates: "April 2026-Present",
    details: [
      "Removed invasive species including herb robert, red campion, and smallflower balsam across Stanley Park habitat zones.",
      "Applied native/invasive plant identification in active field conditions.",
      "Supported site monitoring and habitat recovery tracking.",
    ],
  },
  {
    title: "Water Conservation Data Collection Specialist",
    org: "Engaging Minds Consulting",
    place: "Metro Vancouver",
    dates: "May-July 2026",
    details: [
      "Recommended a Google My Maps route-overlay solution, reducing navigation errors for 30 staff across 322 routes in 12 municipalities.",
      "Recorded 200+ water restriction infractions via ArcGIS Survey123.",
      "Performed large-scale field monitoring across municipalities.",
    ],
  },
  {
    title: "Founder & Operations Manager",
    org: "E-commerce",
    place: "Hong Kong",
    dates: "March 2020-June 2022",
    details: [
      "Built Excel KPI dashboards for inventory, margin, and performance tracking.",
      "Scaled operations from $300 to $15,000 USD.",
    ],
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.08,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

type AnchorProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
};

function SmoothAnchor({ href, children, className = "", variant = "ghost" }: AnchorProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
  };

  const variantClass =
    variant === "primary"
      ? "bg-forest-terminal text-forest-deep shadow-glow"
      : "bg-white/[0.07] text-forest-fog shadow-[0_16px_42px_rgba(0,0,0,0.18)]";

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-heading text-sm font-semibold ${variantClass} ${className}`}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}

function FloatingNav() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const opacity = useTransform(scrollY, [0, 80, 140], [0, 0, 1]);
  const y = useTransform(scrollY, [0, 140], [-22, 0]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 96);
  });

  return (
    <motion.nav
      aria-label="Primary navigation"
      className={`fixed left-1/2 top-5 z-50 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-full bg-[#122018]/70 px-3 py-2 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ opacity, y }}
    >
      <div className="flex items-center justify-between gap-2">
        <SmoothAnchor
          href="#top"
          className="px-4 py-2 text-xs text-forest-glow sm:text-sm"
        >
          GHL
        </SmoothAnchor>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <SmoothAnchor
              key={link.href}
              href={link.href}
              className="hidden px-4 py-2 text-xs text-forest-fog sm:inline-flex sm:text-sm"
            >
              {link.label}
            </SmoothAnchor>
          ))}
          <SmoothAnchor
            href="#contact"
            variant="primary"
            className="px-4 py-2 text-xs sm:text-sm"
          >
            Contact
          </SmoothAnchor>
        </div>
      </div>
    </motion.nav>
  );
}

function OrganicBlobs() {
  const reduceMotion = useReducedMotion();
  const blobs = [
    {
      className: "left-[-8rem] top-[18rem] h-72 w-72 text-forest-terminal/30",
      d: "M146.2 20.8C191.8 26.7 221.7 75.7 224.1 121.5C226.6 167.4 201.4 210 159.3 227.7C117.2 245.4 58.2 238.3 28.2 201.5C-1.8 164.6 -2.8 98.1 29.8 57.9C62.5 17.7 100.7 14.9 146.2 20.8Z",
      animate: { x: [0, 32, -10, 0], y: [0, -28, 18, 0], rotate: [0, 8, -5, 0] },
      duration: 22,
    },
    {
      className: "right-[-7rem] top-[44rem] h-96 w-96 text-forest-moss/20",
      d: "M179.3 32.3C224.7 60.3 247.4 126 227.6 181.4C207.9 236.8 145.7 281.9 90.5 268.4C35.4 254.8 -12.8 182.7 4.5 127.1C21.8 71.6 104 32.6 179.3 32.3Z",
      animate: { x: [0, -24, 12, 0], y: [0, 30, -20, 0], rotate: [0, -10, 6, 0] },
      duration: 26,
    },
    {
      className: "left-[58%] top-[92rem] h-80 w-80 text-forest-fern/20",
      d: "M139.2 7.6C188.9 10.6 242.8 43 252.3 91.8C261.8 140.5 226.9 205.6 174.2 226.7C121.5 247.9 51.1 225.1 21.6 178.6C-7.9 132.2 3.4 62.2 43.9 27C84.4 -8.2 89.5 4.6 139.2 7.6Z",
      animate: { x: [0, 18, -26, 0], y: [0, -18, 24, 0], rotate: [0, 7, -8, 0] },
      duration: 28,
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {blobs.map((blob) => (
        <motion.svg
          key={blob.d}
          viewBox="0 0 280 280"
          className={`absolute blur-3xl ${blob.className}`}
          animate={reduceMotion ? undefined : blob.animate}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <path fill="currentColor" d={blob.d} />
        </motion.svg>
      ))}
    </div>
  );
}

type AnimatedSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
};

function AnimatedSection({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={`scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 ${className}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={childVariants}
          className="font-mono text-xs font-bold uppercase text-forest-terminal"
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          variants={childVariants}
          className="mt-4 max-w-3xl font-heading text-4xl font-semibold text-forest-fog sm:text-5xl"
        >
          {title}
        </motion.h2>
        {children}
      </div>
    </motion.section>
  );
}

function Pill({ children, subtle = false }: { children: ReactNode; subtle?: boolean }) {
  return (
    <motion.span
      variants={childVariants}
      className={`inline-flex rounded-full px-4 py-2 font-mono text-xs ${
        subtle
          ? "bg-white/[0.06] text-forest-moss"
          : "bg-forest-terminal/15 text-forest-glow"
      }`}
      whileHover={{ y: -2, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.span>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.16]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x * 34);
    mouseY.set(y * 26);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/forest-hero.svg')",
          y: reduceMotion ? 0 : backgroundY,
          scale: reduceMotion ? 1.08 : backgroundScale,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,19,16,0.96)_0%,rgba(14,19,16,0.72)_44%,rgba(14,19,16,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_18%,rgba(69,160,102,0.24),transparent_29rem)]" />

      <motion.div
        className="absolute right-[8%] top-[17%] h-44 w-44 rounded-full bg-forest-terminal/10 blur-2xl"
        style={{ x: reduceMotion ? 0 : springX, y: reduceMotion ? 0 : springY }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          animate="show"
          variants={sectionVariants}
        >
          <motion.div className="flex flex-wrap gap-3" variants={childVariants}>
            {roleTags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </motion.div>

          <motion.h1
            variants={childVariants}
            className="mt-8 font-heading text-6xl font-bold leading-[0.98] text-forest-fog sm:text-7xl lg:text-8xl"
          >
            Geoffrey Hong Kei Lee
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-7 max-w-2xl text-lg leading-8 text-forest-fog/78 sm:text-xl"
          >
            Environmental scientist and developer in Vancouver, BC, building practical
            tools for contaminated sites, field monitoring, and spatial risk decisions.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <SmoothAnchor href="#projects" variant="primary">
              View projects <ArrowUpRight size={18} aria-hidden="true" />
            </SmoothAnchor>
            <motion.a
              href="mailto:geoffreylhk@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.07] px-5 py-3 font-heading text-sm font-semibold text-forest-fog shadow-[0_16px_42px_rgba(0,0,0,0.18)]"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              Contact Geoffrey <Mail size={18} aria-hidden="true" />
            </motion.a>
          </motion.div>

          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-wrap items-center gap-4 text-sm text-forest-moss"
          >
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" /> Vancouver, BC
            </span>
            <span className="inline-flex items-center gap-2">
              <Sprout size={16} aria-hidden="true" /> Simon Fraser University
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <AnimatedSection
      id="skills"
      eyebrow="Technical capabilities"
      title="Environmental assessment, spatial analysis, and field-ready data systems."
    >
      <div className="mt-14 grid gap-12 md:grid-cols-2">
        {skillGroups.map((group) => (
          <motion.div key={group.title} variants={childVariants}>
            <h3 className="font-heading text-2xl font-semibold text-forest-fog">
              {group.title}
            </h3>
            <motion.div
              className="mt-5 flex flex-wrap gap-3"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.045 } },
              }}
            >
              {group.skills.map((skill) => (
                <Pill key={skill} subtle>
                  {skill}
                </Pill>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function useCardTilt() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRotateX = useSpring(rotateX, { stiffness: 140, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 140, damping: 18 });

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 12);
    rotateY.set((px - 0.5) * 12);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return {
    rotateX: springRotateX,
    rotateY: springRotateY,
    glareX,
    glareY,
    handleMove,
    handleLeave,
  };
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const tilt = useCardTilt();
  const reduceMotion = useReducedMotion();
  const glare = useTransform(
    [tilt.glareX, tilt.glareY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(143, 224, 168, 0.18), transparent 34%)`,
  );

  return (
    <motion.article
      variants={childVariants}
      className={`${project.featured ? "md:col-span-2" : ""}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="tilt-card relative h-full overflow-hidden rounded-[2rem] bg-white/[0.055] p-6 shadow-[0_28px_110px_rgba(0,0,0,0.25)] sm:p-8"
        style={{
          rotateX: reduceMotion ? 0 : tilt.rotateX,
          rotateY: reduceMotion ? 0 : tilt.rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={tilt.handleMove}
        onMouseLeave={tilt.handleLeave}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{ background: glare }}
          aria-hidden="true"
        />
        <div className="tilt-depth relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <Pill>{project.eyebrow}</Pill>
            <Pill subtle>{project.period}</Pill>
          </div>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-heading text-3xl font-semibold text-forest-fog sm:text-4xl">
                {project.title}
              </h3>
              <p className="mt-5 max-w-3xl text-base leading-7 text-forest-fog/74">
                {project.summary}
              </p>
            </div>
            {project.href ? (
              <motion.a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title}`}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-terminal text-forest-deep shadow-glow"
                whileHover={{ rotate: 8, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <ExternalLink size={20} aria-hidden="true" />
              </motion.a>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.stack.map((item) => (
              <Pill key={item} subtle>
                {item}
              </Pill>
            ))}
          </div>
          <ul className="mt-8 space-y-4 text-sm leading-6 text-forest-fog/70">
            {project.details.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-terminal shadow-glow" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.article>
  );
}

function Projects() {
  return (
    <AnimatedSection
      id="projects"
      eyebrow="Selected projects"
      title="Tools and models built where environmental science meets practical decisions."
    >
      <motion.div className="mt-14 grid gap-6 md:grid-cols-2" variants={childVariants}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </motion.div>
    </AnimatedSection>
  );
}

function Experience() {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 72%", "end 42%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <AnimatedSection
      id="experience"
      eyebrow="Field and operations"
      title="A timeline of habitat restoration, municipal field data, and operational systems."
    >
      <div ref={timelineRef} className="relative mt-16">
        <div className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px origin-top bg-forest-terminal/18 md:left-1/2" />
        <motion.div
          className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px origin-top bg-forest-terminal shadow-glow md:left-1/2"
          style={{ scaleY: lineScale as MotionValue<number> }}
        />
        <div className="space-y-14">
          {experience.map((item, index) => (
            <motion.article
              key={`${item.title}-${item.dates}`}
              className={`relative grid gap-6 pl-12 md:grid-cols-2 md:pl-0 ${
                index % 2 === 0 ? "" : "md:[&>div:first-child]:col-start-2"
              }`}
              variants={childVariants}
            >
              <motion.span
                className="absolute left-[0.78rem] top-2 h-7 w-7 rounded-full bg-forest-terminal shadow-glow md:left-[calc(50%-0.86rem)]"
                initial={{ scale: 0.35, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
                aria-hidden="true"
              />
              <div
                className={`${
                  index % 2 === 0 ? "md:pr-14" : "md:col-start-2 md:pl-14"
                }`}
              >
                <p className="font-mono text-xs text-forest-terminal">{item.dates}</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-forest-fog">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-forest-moss">
                  {item.org}
                  {item.type ? ` - ${item.type}` : ""} / {item.place}
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-forest-fog/72">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-moss" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function Contact() {
  return (
    <motion.footer
      id="contact"
      className="relative z-10 scroll-mt-24 px-5 pb-10 pt-20 sm:px-8 lg:px-12"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={childVariants}
          className="font-mono text-xs font-bold uppercase text-forest-terminal"
        >
          Contact
        </motion.p>
        <motion.div
          variants={childVariants}
          className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h2 className="max-w-3xl font-heading text-4xl font-semibold text-forest-fog sm:text-5xl">
              Let us talk field data, restoration, or environmental tools.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-forest-fog/72">
              Simon Fraser University - Bachelor of Environment (B.Env), Resource
              and Environmental Management. Certified in WHMIS and TDG.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="mailto:geoffreylhk@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-terminal px-5 py-3 font-heading text-sm font-semibold text-forest-deep shadow-glow"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Mail size={18} aria-hidden="true" /> geoffreylhk@gmail.com
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/geoffreyleehk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.07] px-5 py-3 font-heading text-sm font-semibold text-forest-fog shadow-[0_16px_42px_rgba(0,0,0,0.18)]"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Linkedin size={18} aria-hidden="true" /> LinkedIn
            </motion.a>
          </div>
        </motion.div>
        <motion.div
          variants={childVariants}
          className="mt-16 flex flex-col gap-5 text-sm text-forest-moss sm:flex-row sm:items-center sm:justify-between"
        >
          <p>Geoffrey Hong Kei Lee / Vancouver, BC</p>
          <div className="flex flex-wrap gap-3">
            <Pill subtle>Environmental Scientist</Pill>
            <Pill subtle>Field Researcher</Pill>
            <Pill subtle>Developer</Pill>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default function App() {
  return (
    <div className="forest-noise relative min-h-screen overflow-hidden bg-forest-base text-forest-fog">
      <OrganicBlobs />
      <FloatingNav />
      <main className="relative z-10">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <motion.a
        href="https://github.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="fixed bottom-5 right-5 z-40 hidden h-12 w-12 items-center justify-center rounded-full bg-white/[0.07] text-forest-fog shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:inline-flex"
        whileHover={{ y: -3, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        <Github size={19} aria-hidden="true" />
      </motion.a>
    </div>
  );
}
