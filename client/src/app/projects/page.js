"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FolderGit2, Plus, Trash2, GitBranch, ExternalLink, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { getProjects, createProject, deleteProject } from "@/services/project.service"
import useAuthStore from "@/store/auth.store"
import AppShell from "@/components/AppShell"

export default function ProjectsPage() {
  const router = useRouter()
  const authUser = useAuthStore((s) => s.user)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ title: "", description: "", githubUrl: "", liveUrl: "", techStack: "" })

  const fetchProjects = async () => {
    try { const data = await getProjects(); setProjects(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    const user = authUser ?? (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null)
    if (!user) { router.push("/login"); return }
    try {
      setSaving(true); setError("")
      await createProject({ ...formData, userId: user.id })
      setFormData({ title: "", description: "", githubUrl: "", liveUrl: "", techStack: "" })
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project")
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { setDeletingId(id); await deleteProject(id); setProjects((prev) => prev.filter((p) => p.id !== id)) }
    finally { setDeletingId(null) }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3"><FolderGit2 className="w-7 h-7 text-emerald-400" />Projects</h1>
            <p className="text-muted-foreground mt-1">Showcase your work and side projects</p>
          </div>
          <button id="toggle-project-form" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all">
            {showForm ? <><ChevronUp className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Project</>}
          </button>
        </div>

        {showForm && (
          <div className="rounded-2xl border border-primary/20 bg-card p-6 space-y-4">
            <h2 className="text-base font-semibold mb-2">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project Title *</label>
                  <input name="title" value={formData.title} onChange={handleChange} required placeholder="My Awesome Project" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tech Stack</label>
                  <input name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Node.js, PostgreSQL" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="What does this project do?" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">GitHub URL</label>
                  <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Live URL</label>
                  <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://myproject.com" className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all" />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button id="create-project-btn" type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border/50">
            <FolderGit2 className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No projects yet. Click &quot;Add Project&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {projects.map((project) => (
              <div key={project.id} className="group rounded-2xl border border-border/50 bg-card p-5 card-hover flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-base font-bold leading-tight">{project.title}</h2>
                  <button onClick={() => handleDelete(project.id)} disabled={deletingId === project.id} className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100" title="Delete project">
                    {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{project.description}</p>
                {project.techStack && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.split(",").map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{tech.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-auto">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all">
                      <GitBranch className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}