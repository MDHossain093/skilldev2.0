"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Globe, Link2, MapPin, ExternalLink, BrainCircuit, TrendingUp, Pencil } from "lucide-react"
import useAuthStore from "@/store/auth.store"
import { getProfile } from "@/services/profile.service"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"
import EditProfileDialog from "@/components/profile/EditProfileDialog"
import AppShell from "@/components/AppShell"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    Promise.all([
      getProfile(user.id).then(setProfile),
      getSkills(user.id).then(setSkills),
      getProjects(user.id).then(setProjects),
    ]).finally(() => setLoading(false))
  }, [user, router])

  // Keep the root mounted with a stable placeholder while we wait for auth.
// Returning null here causes React 19 + DevTools to race during the
// null → full-tree swap, throwing `insertBefore` NotFoundError.
  if (!user) {
    return (
      <AppShell>
        <div data-profile-placeholder="" hidden />
      </AppShell>
    )
  }

  const completion = profile
    ? Math.round([profile.bio, profile.github, profile.linkedin, profile.portfolio, profile.location].filter(Boolean).length / 5 * 100)
    : 0

  const initials = user.name?.charAt(0).toUpperCase()

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Developer Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your developer identity and portfolio</p>
        </div>

        {!loading && completion < 100 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4">
            <TrendingUp className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-primary font-semibold">{completion}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-primary/20 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {profile?.image ? (
                  <img src={profile.image} alt={user.name} className="w-24 h-24 rounded-full object-cover border-2 border-primary/30 mb-4" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary mb-4">{initials}</div>
                )}
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {profile?.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
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
                {profile?.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">Portfolio</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
              </div>
              <div className="mt-6">
                <EditProfileDialog userId={user.id} profile={profile} onProfileUpdated={setProfile} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{skills.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Skills</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{projects.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Projects</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h3 className="text-lg font-bold mb-3">About Me</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {profile?.bio?.trim() ? profile.bio : "No bio yet. Click Edit Profile to tell the community about yourself."}
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Skills</h3>
                <Link href="/skills" className="text-xs text-primary hover:underline flex items-center gap-1"><Pencil className="w-3 h-3" /> Manage</Link>
              </div>
              {skills.length === 0 ? (
                <p className="text-muted-foreground text-sm">No skills yet. <Link href="/skills" className="text-primary hover:underline">Add your first skill →</Link></p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.id} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{skill.name}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Projects</h3>
                <Link href="/projects" className="text-xs text-primary hover:underline flex items-center gap-1"><Pencil className="w-3 h-3" /> Manage</Link>
              </div>
              {projects.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects yet. <Link href="/projects" className="text-primary hover:underline">Add your first project →</Link></p>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="rounded-xl border border-border/40 bg-secondary/30 p-4">
                      <h4 className="font-semibold text-sm">{project.title}</h4>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{project.description}</p>
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
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-card/50 backdrop-blur-sm rounded-2xl" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">AI Mentor</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">Get personalized skill gap analysis, career roadmaps, and AI-powered career advice.</p>
                  <Link href="/ai-mentor" className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                    Open AI Mentor <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}