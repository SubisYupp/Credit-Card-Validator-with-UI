"use client";

import { motion } from "framer-motion";
import CursorWave from "@/components/CursorWave";
import CreditCard from "@/components/CreditCard";
import { ArrowRight, Github } from "lucide-react";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      {/* Cursor trailing wave */}
      <CursorWave />

      {/* Floating gradient blob for bolt-like vibe */}
      <div className="hero-blob" />

      {/* Navbar */}
      <div className="relative z-20">
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-6">
          <div className="text-lg font-semibold tracking-tight">
            <span className="gradient-text">WaveCard</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#demo" className="hover:text-white">Demo</a>
            <a href="https://github.com" target="_blank" className="inline-flex items-center gap-2 hover:text-white">
              <Github size={18}/> GitHub
            </a>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative z-20 mx-auto max-w-6xl px-6 pt-10 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-semibold leading-tight"
        >
          Credit cards, but <span className="gradient-text">smoother</span>.
        </motion.h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          A minimal credit card experience with a fluid, free‑flowing wave that follows your cursor.
          Built with Next.js + Tailwind + Framer Motion. Inspired by the clean vibes of bolt.new.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <a href="#demo" className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-gray-900 hover:bg-cyan-400 transition">
            See the demo <ArrowRight className="transition group-hover:translate-x-0.5" size={18}/>
          </a>
          <a href="#features" className="rounded-xl px-5 py-3 glass">Explore features</a>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="relative z-20 mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            <CreditCard />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">Interactive 3D tilt</h2>
            <p className="text-gray-300">
              Move your cursor over the card and feel the subtle 3D tilt & glossy shine.
              The background features a layered gradient and the mouse leaves a glowing wave behind it.
            </p>
            <ul className="list-disc list-inside text-gray-300">
              <li>Responsive, glassy UI</li>
              <li>Cursor-trailing wave (Canvas)</li>
              <li>Smooth animations (Framer Motion)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-20 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Next.js 14", "App Router, fast by default"],
            ["Tailwind CSS", "Utility-first styling for rapid iteration"],
            ["Framer Motion", "Orchestrated, buttery animations"]
          ].map(([title, desc]) => (
            <div key={title} className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} WaveCard</span>
          <span>Made for you ✨</span>
        </div>
      </footer>
    </main>
  );
}
