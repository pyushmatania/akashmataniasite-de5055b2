import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Typed from "typed.js";
import Atropos from "atropos/react";
import "atropos/css";
import Lenis from "@studio-freight/lenis";
import confetti from "canvas-confetti";
import { fadeUp, scaleIn, staggerContainer, pageTransition } from "@/lib/variants";

const akashPhoto = "/images/akash-photo.jpeg";

const skills = [
  { label: "PRODUCT STRATEGY", color: "hsl(145, 63%, 49%)" },
  { label: "USER RESEARCH", color: "hsl(43, 96%, 56%)" },
  { label: "WEB3 & FINTECH", color: "hsl(0, 78%, 62%)" },
  { label: "GROWTH & ANALYTICS", color: "hsl(43, 96%, 56%)" },
  { label: "TECHNICAL PRDs", color: "hsl(145, 63%, 49%)" },
  { label: "AI-ASSISTED DEVELOPMENT", color: "hsl(0, 78%, 62%)" },
];

const MyStory = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const typedRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis smooth scroll
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenisRef.current?.destroy();
  }, []);

  // Typed.js typewriter on tagline
  useEffect(() => {
    if (!typedRef.current) return;
    const typed = new Typed(typedRef.current, {
      strings: [
        "Engineering → Product → Web3 → AI",
        "0 to 1 builder.",
        "Craft meets curiosity.",
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
    return () => typed.destroy();
  }, []);

  // Canvas confetti on mount — subtle, respects reduced motion
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#fbbf24", "#f87171", "#c084fc", "#60a5fa"],
        scalar: 0.9,
        ticks: 200,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Top bar: back + dark mode toggle */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <motion.button
            onClick={() => navigate("/")}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </motion.button>
        </motion.div>

        {/* Animated gradient headline */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            background:
              "linear-gradient(135deg, hsl(145,63%,49%), hsl(43,96%,56%), hsl(0,78%,62%), hsl(280,70%,55%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          My story
        </motion.h1>

        {/* Typewriter tagline */}
        <motion.p
          className="text-muted-foreground text-lg mb-10 h-7"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <span ref={typedRef} />
        </motion.p>

        {/* Bio paragraphs */}
        <motion.p
          className="text-muted-foreground text-lg leading-relaxed mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          I started in computer science engineering, moved into product
          management across fintech, edtech, and Web3, and somewhere along the
          way fell in love with building products from 0 to 1. Now I sit at the
          intersection of product thinking and emerging technology — scaling
          platforms to 5,000+ users, achieving product-market fit, and driving
          teams to ship faster.
        </motion.p>

        <motion.p
          className="text-foreground text-2xl md:text-[1.7rem] font-bold leading-snug mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          I believe the best products happen when craft meets curiosity. I care
          about the details that most people won't notice but everyone will feel
          — the clarity of a user flow, the precision of a roadmap, the moment
          a feature earns its place.
        </motion.p>

        <motion.p
          className="text-muted-foreground text-lg leading-relaxed mb-14"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          I build with AI the way a photographer works with light — it's a
          medium, not a shortcut. The taste, the decisions, the product
          direction? That's still very human. That's still mine.
        </motion.p>

        {/* Atropos 3D tilt profile image */}
        <motion.div
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <Atropos
            className="rounded-2xl"
            activeOffset={24}
            shadowScale={1.04}
            highlight={true}
            rotateXMax={8}
            rotateYMax={8}
          >
            <div
              className="relative p-1.5 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, hsl(145,63%,49%), hsl(43,96%,56%), hsl(0,78%,62%), hsl(280,70%,55%), hsl(200,80%,55%))",
                boxShadow:
                  "0 8px 32px -8px hsla(280,70%,55%,0.35), 0 4px 16px -4px hsla(0,78%,62%,0.25)",
              }}
            >
              <div className="rounded-xl overflow-hidden bg-background" data-atropos-offset="4">
                <img
                  src={akashPhoto}
                  alt="Akash Matania"
                  className="w-full aspect-[4/3] object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </Atropos>
        </motion.div>

        {/* Skill badges with stagger + spring hover */}
        <motion.div
          className="flex flex-wrap gap-3 pb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {skills.map((skill, i) => (
            <motion.span
              key={skill.label}
              className="px-5 py-2.5 rounded-full text-sm font-bold tracking-wide text-white cursor-default select-none"
              variants={scaleIn}
              custom={i}
              style={{ backgroundColor: skill.color }}
              whileHover={{
                scale: 1.1,
                boxShadow: `0 4px 20px -4px ${skill.color}99`,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              {skill.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyStory;
