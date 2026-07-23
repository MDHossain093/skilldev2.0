"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react"

import AppShell from "@/components/AppShell"
import ModernTemplate from "@/components/portfolio/ModernTemplate"
import MinimalTemplate from "@/components/portfolio/MinimalTemplate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import useAuthStore from "@/store/auth.store"
import usePortfolioStore from "@/store/portfolio.store"
import { getProfile } from "@/services/profile.service"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"

const TEMPLATES = [
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
]

const THEMES = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
]

export default function PortfolioEditorPage() {
  const router = useRouter()
  const { user, hasHydrated } = useAuthStore()

  const {
    portfolio,
    loading,
    saving,
    error,
    load,
    save,
    toggle,
    publish,
  } = usePortfolioStore()

  // Local form state (mirrors portfolio config from server)
  const [form, setForm] = useState({
    username: "",
    headline: "",
    about: "",
    template: "modern",
    theme: "dark",
    showAbout: true,
    showSkills: true,
    showProjects: true,
    isPublished: false,
  })

  // Live preview data: user + portfolio (form) + fetched profile/skills/projects
  const [profileData, setProfileData] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])

  // Wait for Zustand hydration before deciding to redirect.
  useEffect(() => {
    if (!hasHydrated) return
    if (!user) {
      router.replace("/login")
    }
  }, [hasHydrated, user, router])

  // Load portfolio config + supporting data once user is known.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    load(user.id)
    Promise.all([
      getProfile(user.id).catch(() => null),
      getSkills(user.id).catch(() => []),
      getProjects(user.id).catch(() => []),
    ]).then(([p, s, pr]) => {
      if (cancelled) return
      setProfileData(p)
      setSkills(Array.isArray(s) ? s : [])
      setProjects(Array.isArray(pr) ? pr : [])
    })
    return () => {
      cancelled = true
    }
  }, [user, load])

  // Sync server state into the form whenever portfolio loads/changes.
  useEffect(() => {
    if (!portfolio) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((prev) => ({
      ...prev,
      username: portfolio.username || "",
      headline: portfolio.headline || "",
      about: portfolio.about || "",
      template: portfolio.template || "modern",
      theme: portfolio.theme || "dark",
      showAbout: portfolio.showAbout ?? true,
      showSkills: portfolio.showSkills ?? true,
      showProjects: portfolio.showProjects ?? true,
      isPublished: portfolio.isPublished ?? false,
    }))
  }, [portfolio])

  // The object the preview template renders — combines portfolio config + live data.
  const previewData = useMemo(() => {
    const liveProfile = profileData || {}
    return {
      portfolio: {
        ...portfolio,
        ...form,
      },
      user: user
        ? {
            id: user.id,
            name: user.name,
          }
        : null,
      profile: {
        bio: liveProfile.bio,
        github: liveProfile.github,
        linkedin: liveProfile.linkedin,
        image: liveProfile.image,
        location: liveProfile.location,
      },
      skills,
      projects,
    }
  }, [portfolio, form, profileData, skills, projects, user])

  const Template = form.template === "minimal" ? MinimalTemplate : ModernTemplate

  const handleSave = async () => {
    if (!user) return
    try {
      await save(user.id, {
        username: form.username || undefined,
        headline: form.headline,
        about: form.about,
        template: form.template,
        theme: form.theme,
      })
    } catch {
      /* store has the error */
    }
  }

  const handleToggleSection = async (key) => {
    if (!user) return
    const next = !form[key]
    setForm((f) => ({ ...f, [key]: next }))
    await toggle(user.id, { [key]: next })
  }

  const handlePublishToggle = async () => {
    if (!user) return
    const next = !form.isPublished
    setForm((f) => ({ ...f, isPublished: next }))
    await publish(user.id, next)
  }

  if (!hasHydrated || !user) return null

  const publicUrl =
    form.username && form.isPublished
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${form.username}`
      : null

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Builder</h1>
            <p className="text-muted-foreground mt-1">
              Configure your public portfolio. Skills and projects are pulled
              live from your profile.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {publicUrl ? (
              <Button asChild variant="outline" size="sm">
                <a href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-3.5" />
                  View live
                </a>
              </Button>
            ) : null}
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              size="sm"
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-6">
          {/* Editor */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
              <h2 className="font-semibold">Identity</h2>
              <div className="space-y-2">
                <Label htmlFor="username">Public URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/p/</span>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        username: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, ""),
                      }))
                    }
                    placeholder="your-name"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  3–30 chars, lowercase letters, numbers, _ or -.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={form.headline}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, headline: e.target.value }))
                  }
                  placeholder="Full-stack engineer · Open-source contributor"
                  maxLength={120}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  rows={6}
                  value={form.about}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, about: e.target.value }))
                  }
                  placeholder="Tell visitors who you are and what you build."
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {form.about.length}/2000
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
              <h2 className="font-semibold">Style</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          setForm((f) => ({ ...f, template: t.id }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          form.template === t.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex flex-wrap gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          setForm((f) => ({ ...f, theme: t.id }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          form.theme === t.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
              <h2 className="font-semibold">Sections</h2>
              <Toggle
                label="Show About"
                value={form.showAbout}
                onChange={() => handleToggleSection("showAbout")}
              />
              <Toggle
                label="Show Skills"
                value={form.showSkills}
                onChange={() => handleToggleSection("showSkills")}
              />
              <Toggle
                label="Show Projects"
                value={form.showProjects}
                onChange={() => handleToggleSection("showProjects")}
              />
            </section>

            <section className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
              <h2 className="font-semibold">Publishing</h2>
              <Toggle
                label="Public"
                value={form.isPublished}
                onChange={handlePublishToggle}
                help={
                  form.isPublished
                    ? "Live at the URL above."
                    : "Toggle on to make this portfolio publicly viewable."
                }
              />
            </section>

            <p className="text-xs text-muted-foreground">
              Bio, social links and avatar are managed in your{" "}
              <Link href="/profile" className="text-primary hover:underline">
                profile
              </Link>
              . Skills at{" "}
              <Link href="/skills" className="text-primary hover:underline">
                /skills
              </Link>{" "}
              and projects at{" "}
              <Link href="/projects" className="text-primary hover:underline">
                /projects
              </Link>
              .
            </p>
          </aside>

          {/* Live preview */}
          <section className="rounded-2xl border border-border/50 overflow-hidden bg-background min-h-[600px]">
            <div className="border-b border-border/50 px-4 py-2 flex items-center justify-between bg-card">
              <p className="text-xs text-muted-foreground">Live preview</p>
              <p className="text-xs">
                {loading ? "Loading…" : saving ? "Saving…" : "Saved"}
              </p>
            </div>
            <div className="h-[calc(100vh-220px)] min-h-[600px] overflow-y-auto">
              <Template data={previewData} />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function Toggle({ label, value, onChange, help }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full flex items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        {help ? <p className="text-xs text-muted-foreground mt-0.5">{help}</p> : null}
      </div>
      <span
        className={`inline-flex size-5 items-center justify-center rounded-full transition-colors ${
          value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {value ? (
          <Eye className="size-3" />
        ) : (
          <EyeOff className="size-3" />
        )}
      </span>
    </button>
  )
}
