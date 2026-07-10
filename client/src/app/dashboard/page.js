"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BrainCircuit, Code2, FolderGit2, Users, Search, User, ArrowRight, Sparkles, TrendingUp } from "lucide-react"
import useAuthStore from "@/store/auth.store"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"
import { getProfile } from "@/services/profile.service"
import AppShell from "@/components/AppShell"

const quickLinks = [
  { title: "Skills", description: "Add and manage your tech stack", href: "/skills", icon: Code2, gradient: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-500/20", iconColor: "text-cyan-400" },
  { title: "Projects", description: "Showcase your work & demos", href: "/projects", icon: FolderGit2, gradient: "from-emerald-500/20 to-green-500/10", border: "border-emerald-500/20", iconColor: "text-emerald-400" },
  { title: "AI Mentor", description: "Get personalized career guidance", href: "/ai-mentor", icon: BrainCircuit, gradient: "from-violet-500/20 to-purple-500/10", border: "border-violet-500/20", iconColor: "text-violet-400" },
  { title: "Team Match", description: "Find complementary teammates", href: "/team-match", icon: Users, gradient: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/20", iconColor: "text-orange-400" },
  { title: "Search", description: "Discover developers by skill", href: "/search", icon: Search, gradient: "from-pink-500/20 to-rose-500/10", border: "border-pink-500/20", iconColor: "text-pink-400" },
  { title: "Profile", description: "Edit your developer identity", href: "/profile", icon: User, gradient: "from-slate-500/20 to-gray-500/10", border: "border-slate-500/20", iconColor: "text-slate-400" },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      Promise.all([
        getSkills().then(setSkills),
        getProjects().then(setProjects),
        getProfile(user.id).then(setProfile),
      ]).finally(() => setLoading(false))
    }
  }, [user])

  const completion = profile
    ? Math.round(([profile.bio, profile.github, profile.linkedin, profile.portfolio, profile.location].filter(Boolean).length / 5) * 100)
    : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-muted-foreground text-sm font-medium mb-1">{greeting} 👋</p>
            <h1 className="text-3xl font-bold mb-1">{user?.name ?? "Developer"}</h1>
            <p className="text-muted-foreground">Your developer dashboard. Track progress, manage your portfolio, and get AI-powered insights.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Skills", value: loading ? "—" : skills.length, icon: Code2, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
            { label: "Projects", value: loading ? "—" : projects.length, icon: FolderGit2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { label: "Profile Complete", value: loading ? "—" : `${completion}%`, icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`rounded-2xl border ${border} ${bg} p-5 flex items-center justify-between card-hover`}>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Profile Completion Bar */}
        {!loading && completion < 100 && (
          <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Complete your profile</span>
              </div>
              <span className="text-sm text-muted-foreground">{completion}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              A complete profile unlocks better AI recommendations.{" "}
              <Link href="/profile" className="text-primary hover:underline">Edit profile →</Link>
            </p>
          </div>
        )}

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map(({ title, description, href, icon: Icon, gradient, border, iconColor }) => (
              <Link key={href} href={href} className={`group relative card-hover rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-5 overflow-hidden`}>
                <div className="absolute inset-0 bg-card/50 backdrop-blur-sm rounded-2xl" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-background/60 border ${border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="rounded-2xl border border-border/50 bg-card p-5 card-hover">
                  <h3 className="font-semibold text-sm">{project.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{project.description}</p>
                  {project.techStack && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack.split(",").slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
