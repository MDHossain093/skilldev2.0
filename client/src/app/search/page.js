"use client"

import { useEffect, useState } from "react"
import { Search as SearchIcon, Code2, Loader2 } from "lucide-react"
import { getSkills } from "@/services/skill.service"
import AppShell from "@/components/AppShell"

const SKILL_COLORS = [
  "border-violet-500/25 bg-violet-500/10 text-violet-300",
  "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
  "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  "border-orange-500/25 bg-orange-500/10 text-orange-300",
  "border-pink-500/25 bg-pink-500/10 text-pink-300",
  "border-blue-500/25 bg-blue-500/10 text-blue-300",
  "border-amber-500/25 bg-amber-500/10 text-amber-300",
  "border-teal-500/25 bg-teal-500/10 text-teal-300",
]

export default function SearchPage() {
  const [allSkills, setAllSkills] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSkills().then(setAllSkills).finally(() => setLoading(false))
  }, [])

  const filtered = allSkills.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><SearchIcon className="w-7 h-7 text-pink-400" />Search Skills</h1>
          <p className="text-muted-foreground mt-1">Explore all skills in the SkillDev ecosystem</p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a skill e.g. React, Python, Docker..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold">
              {query ? `Results for "${query}"` : "All Skills in the Ecosystem"}
              <span className="ml-2 text-muted-foreground font-normal text-sm">({loading ? "..." : filtered.length} skills)</span>
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No skills match &quot;{query}&quot;. Try a different search.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {filtered.map((skill, i) => (
                <button
                  key={skill.id}
                  onClick={() => setQuery(query === skill.name ? "" : skill.name)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 active:scale-95 ${SKILL_COLORS[i % SKILL_COLORS.length]} ${query === skill.name ? "ring-2 ring-primary/50" : ""}`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border/40 bg-secondary/30 p-5 flex items-start gap-4">
          <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Looking for developers with specific skills?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Use the <a href="/team-match" className="text-primary hover:underline">Team Match</a> feature to get AI-powered developer recommendations.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
