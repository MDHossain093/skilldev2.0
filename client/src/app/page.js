"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { BrainCircuit, Code2, FolderGit2, Users, ArrowRight, Zap, Star, TrendingUp, Shield } from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "AI Career Mentor",
    description: "Get personalized skill gap analysis, career roadmaps, and tailored advice powered by Gemini AI.",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Code2,
    title: "Skill Tracker",
    description: "Build and manage your tech stack. Visualize your expertise and identify areas for growth.",
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: FolderGit2,
    title: "Project Portfolio",
    description: "Showcase your work with rich project cards, GitHub links, live demos, and tech stack badges.",
    gradient: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Users,
    title: "Team Matching",
    description: "Find complementary developers for your next project using AI-powered team suggestions.",
    gradient: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
  },
]

const stats = [
  { value: "6", label: "AI Analysis Tools", icon: BrainCircuit },
  { value: "∞", label: "Skills to Track", icon: Code2 },
  { value: "100%", label: "Personalized", icon: Star },
  { value: "24/7", label: "AI Availability", icon: Shield },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // Defer to microtask to satisfy react-hooks/set-state-in-effect.
    queueMicrotask(() => setMounted(true))
  }, [])

  return (
    <div className="min-h-screen animated-gradient-bg overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold gradient-text">SkillDev</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/register" className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none float-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl pointer-events-none float-animation" style={{ animationDelay: "3s" }} />

        <div className={`relative z-10 max-w-5xl mx-auto transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Developer Career Platform
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Accelerate Your<br />
            <span className="gradient-text">Developer Career</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Track skills, showcase projects, and get AI-powered career guidance. SkillDev helps developers grow faster with intelligent insights tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5">
              Start for Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border/60 text-foreground font-semibold text-base hover:bg-secondary/60 hover:border-primary/40 transition-all">
              Sign In
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center border border-border/30">
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold gradient-text">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need to <span className="gradient-text">level up</span></h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">A complete toolkit for developer growth, from skill tracking to AI mentorship.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, description, gradient, border, iconColor }) => (
            <div key={title} className={`card-hover relative rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-6 overflow-hidden`}>
              <div className="absolute inset-0 bg-card/60 backdrop-blur-sm rounded-2xl" />
              <div className="relative z-10">
                <div className={`w-11 h-11 rounded-xl bg-background/80 border ${border} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-primary/20 glow">
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to grow your career?</h2>
          <p className="text-muted-foreground text-lg mb-8">Join SkillDev and let AI guide your path to becoming a better developer.</p>
          <Link href="/register" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-2xl hover:shadow-primary/30">
            Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-semibold gradient-text">SkillDev</span>
        </div>
        <p className="text-muted-foreground text-sm">© 2025 SkillDev. AI-powered developer career platform.</p>
      </footer>
    </div>
  )
}
