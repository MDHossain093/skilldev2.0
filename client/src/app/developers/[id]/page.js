"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Mail, Globe, Link2, ExternalLink, ArrowLeft, Loader2,
  Code2, FolderGit2,
} from "lucide-react"
import { getUserById } from "@/services/user.service"
import AppShell from "@/components/AppShell"

function initialsOf(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"
}

export default function DeveloperDetailPage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    getUserById(id)
      .then(setUser)
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load developer"))
      .finally(() => setLoading(false))
  }, [id])

  const profile = user?.profile

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <Link href="/developers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Developers
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>
        ) : !user ? (
          <div className="rounded-2xl border border-border/50 bg-card p-6 text-sm text-muted-foreground">Developer not found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  {profile?.image ? (
                    <img src={profile.image} alt={user.name} className="w-24 h-24 rounded-full object-cover border-2 border-primary/30 mb-4" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary mb-4">
                      {initialsOf(user.name)}
                    </div>
                  )}
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {profile?.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Link2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">GitHub</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">LinkedIn</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                  <p className="text-2xl font-bold gradient-text">{user.skills.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Skills</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                  <p className="text-2xl font-bold gradient-text">{user.projects.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Projects</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="text-lg font-bold mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {profile?.bio?.trim() ? profile.bio : "This developer hasn't added a bio yet."}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-primary" />Skills</h3>
                {user.skills.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No skills listed.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{skill.name}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FolderGit2 className="w-4 h-4 text-accent" />Projects</h3>
                {user.projects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No projects yet.</p>
                ) : (
                  <div className="space-y-3">
                    {user.projects.map((project) => (
                      <div key={project.id} className="rounded-xl border border-border/40 bg-secondary/30 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-semibold text-sm">{project.title}</h4>
                          <div className="flex items-center gap-2 shrink-0">
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Source">
                                <Link2 className="w-4 h-4" />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Live">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{project.description}</p>
                        {project.techStack && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.techStack.split(",").map((tech) => (
                              <span key={tech} className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">{tech.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
