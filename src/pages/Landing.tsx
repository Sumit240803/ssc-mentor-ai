import React from "react";
import { motion, Variants } from "framer-motion";
import { Brain, Calendar, BookOpen, Sparkles, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";

// Animation Variants
const fadeInUp : Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

// Features for SSC Exam
const features = [
  {
    title: "AI Mock Test & Analysis",
    description:
      "Attempt simulated exam based on latest pattern with instant AI-driven analysis to identify your strength and weakness and Suggestions to improve by AI teacher.",
    icon: Brain,
  },
  {
    title: "AI Schedule Generator",
    description:
      "Get a personalized study timetable based on your available time and learning pace.",
    icon: Calendar,
  },
  {
    title: "AI Notes & Audio Content",
    description:
      "Access AI-generated study notes, summaries, and audio lectures to learn faster.",
    icon: BookOpen,
  },
  {
    title: "Daily Motivation",
    description:
      "Stay focused with daily motivational quotes, reminders, and progress tracking.",
    icon: Sparkles,
  },
];

// Stats
const stats = [
  { number: "50K+", label: "Aspirants Guided" },
  { number: "10k+", label: "Mock Tests Taken" },
  { number: "92%", label: "Success Rate Improvement" },
];

// Testimonials
const testimonials = [
  {
    name: "Rohit Singh",
    role: "SSC Aspirant",
    quote:
      "The AI mock tests felt exactly like the real exam. The detailed analysis showed me where to improve.",
  },
  {
    name: "Priya Singh",
    role: "Delhi Police Candidate",
    quote:
      "AI-generated schedules helped me balance my job and preparation. It kept me consistent every day.",
  },
  {
    name: "Aman Verma",
    role: "SSC Selected (2024)",
    quote:
      "Daily motivation and smart notes kept me ahead of others. This platform truly boosts confidence.",
  },
];

const Landing = () => {
  return (
    <div className="relative bg-background text-foreground overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-purple-500/20 blur-3xl" />

      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6"
      >
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-5xl md:text-7xl font-bold text-foreground tracking-tight"
        >
          Prepare Smarter for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            SSC Delhi Police Exam 2025
          </span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          India’s first AI-powered platform designed exclusively for SSC Delhi
          Police aspirants based on latest exam pattern of eduquity. Study smarter, stay consistent, and boost your
          chances of success.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-10 flex gap-4"
        >
          <a
            href="/free-mock-test"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Try Free Mock Test
          </a>
          <a
            href="/pricing"
            className="px-6 py-3 rounded-xl border border-cyan-400 text-cyan-600 dark:text-cyan-300 font-semibold backdrop-blur hover:bg-cyan-400/10 transition"
          >
            View Pricing
          </a>
        </motion.div>
      </section>

      {/* Stats */}
      <section
        id="stats"
        className="relative py-20 px-6 bg-gradient-to-b from-transparent to-background/40"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="p-6 rounded-2xl bg-background/60 backdrop-blur border border-white/10 shadow-lg"
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            AI Features Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              SSC Delhi Police
            </span>{" "}
            Preparation
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Smarter, faster, and more effective exam preparation.
          </motion.p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="relative p-8 rounded-3xl bg-background/70 backdrop-blur-lg border border-white/10 hover:border-indigo-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-lg">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl w-fit mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            Hear from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Successful Aspirants
            </span>
          </motion.h2>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="p-8 rounded-3xl bg-background/70 backdrop-blur-lg border border-white/10 hover:border-cyan-400/50 transition-all duration-500"
            >
              <p className="text-muted-foreground italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                  {t.name[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-sm">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-6 relative">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-900/30 to-cyan-900/30 backdrop-blur-lg p-12 shadow-lg relative overflow-hidden"
        >
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Start Your AI-Powered{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              SSC Delhi Police Prep
            </span>{" "}
            Today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take mock tests, generate smart schedules, and prepare with AI
            insights designed for your success.
          </p>
          <a
            href="/pricing"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Join Now
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-white/10 bg-background/60 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* About Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                SSC Mentor AI
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                India's first AI-powered platform for SSC Delhi Police exam
                preparation. Prepare smarter with AI-driven insights.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/free-mock-test"
                    className="text-muted-foreground hover:text-cyan-400 transition"
                  >
                    Free Mock Test
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-muted-foreground hover:text-cyan-400 transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="text-muted-foreground hover:text-cyan-400 transition"
                  >
                    Login / Sign Up
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Contact Support
              </h4>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <a
                  href="mailto:support@examprep.in"
                  className="text-muted-foreground hover:text-cyan-400 transition"
                >
                  support@examprep.in
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-background/50 border border-white/10 hover:border-cyan-400/50 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-muted-foreground hover:text-cyan-400 transition" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-background/50 border border-white/10 hover:border-cyan-400/50 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-muted-foreground hover:text-cyan-400 transition" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-background/50 border border-white/10 hover:border-cyan-400/50 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-muted-foreground hover:text-cyan-400 transition" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-background/50 border border-white/10 hover:border-cyan-400/50 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-cyan-400 transition" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-muted-foreground">
            <p>
              © {new Date().getFullYear()} SSC Mentor AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
