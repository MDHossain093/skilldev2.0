"use client"

import { useCallback, useEffect, useState } from "react"
import { Code2, Plus, X, Loader2 } from "lucide-react"
import { getSkills, createSkill, deleteSkill } from "@/services/skill.service"
import useAuthStore from "@/store/auth.store"
import AppShell from "@/components/AppShell"

const SKILL_COLORS = [
  "bg-violet-500/15 text-violet-300 border-violet-500/25",
  "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  "bg-orange-500/15 text-orange-300 border-orange-500/25",
  "bg-pink-500/15 text-pink-300 border-pink-500/25",
  "bg-blue-500/15 text-blue-300 border-blue-500/25",
  "bg-amber-500/15 text-amber-300 border-amber-500/25",
  "bg-teal-500/15 text-teal-300 border-teal-500/25",
]

export default function SkillsPage() {
  const user = useAuthStore((s) => s.user)
  const [skills, setSkills] = useState([])
  const [skillName, setSkillName] = useState("")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState("")

  const fetchSkills = useCallback(async () => {
    if (!user) return
    try { const data = await getSkills(user.id); setSkills(data) }
    catch { setError("Failed to load skills") }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => {
    // Defer to a microtask so we don't kick off a fetch synchronously inside
    // the effect body (react-hooks/set-state-in-effect).
    queueMicrotask(() => fetchSkills())
  }, [fetchSkills])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!skillName.trim() || !user) return
    try {
      setAdding(true); setError("")
      await createSkill({ name: skillName.trim(), userId: user.id })
      setSkillName("")
      fetchSkills()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add skill")
    } finally { setAdding(false) }
  }

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      await deleteSkill(id, user.id)
      setSkills((prev) => prev.filter((s) => s.id !== id))
    } catch { setError("Failed to delete skill") }
    finally { setDeletingId(null) }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Code2 className="w-7 h-7 text-cyan-400" />My Skills</h1>
          <p className="text-muted-foreground mt-1">Build your tech stack. Click a skill tag to remove it.</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-base font-semibold mb-4">Add a Skill</h2>
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              id="skill-input"
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. React, Python, Docker..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
            <button id="skill-add-btn" type="submit" disabled={adding || !skillName.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-base font-semibold mb-5">
            Your Tech Stack
            {!loading && <span className="ml-2 text-muted-foreground font-normal text-sm">({skills.length} {skills.length === 1 ? "skill" : "skills"})</span>}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No skills added yet. Add your first skill above!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, i) => {
                const colorClass = SKILL_COLORS[i % SKILL_COLORS.length]
                return (
                  <button key={skill.id} onClick={() => handleDelete(skill.id)} disabled={deletingId === skill.id} className={`group flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-80 active:scale-95 ${colorClass}`} title={`Remove ${skill.name}`}>
                    {deletingId === skill.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>{skill.name}<X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}