"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Link as LinkIcon,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Code2,
  Rocket,
  Wrench,
  Send,
} from "lucide-react"

// Soft accent palette for skill pills — mapped by lowercased name.
const SKILL_TINTS = {
  react: "from-cyan-400/20 to-blue-500/20 text-cyan-300 border-cyan-400/30",
  next: "from-zinc-400/20 to-zinc-200/20 text-zinc-100 border-zinc-300/30",
  nextjs: "from-zinc-400/20 to-zinc-200/20 text-zinc-100 border-zinc-300/30",
  "node.js": "from-green-400/20 to-lime-500/20 text-green-300 border-green-400/30",
  nodejs: "from-green-400/20 to-lime-500/20 text-green-300 border-green-400/30",
  express: "from-zinc-400/20 to-zinc-200/20 text-zinc-100 border-zinc-300/30",
  typescript: "from-blue-400/20 to-blue-600/20 text-blue-300 border-blue-400/30",
  javascript: "from-yellow-400/20 to-amber-500/20 text-yellow-300 border-yellow-400/30",
  python: "from-blue-400/20 to-yellow-400/20 text-blue-300 border-blue-400/30",
  tailwind: "from-cyan-400/20 to-sky-500/20 text-cyan-300 border-cyan-400/30",
  "tailwind css": "from-cyan-400/20 to-sky-500/20 text-cyan-300 border-cyan-400/30",
  firebase: "from-amber-400/20 to-orange-500/20 text-amber-300 border-amber-400/30",
  postgresql: "from-blue-400/20 to-indigo-500/20 text-blue-300 border-blue-400/30",
  prisma: "from-zinc-400/20 to-zinc-200/20 text-zinc-100 border-zinc-300/30",
  mongodb: "from-green-400/20 to-emerald-500/20 text-green-300 border-green-400/30",
  docker: "from-blue-400/20 to-cyan-500/20 text-blue-300 border-blue-400/30",
  aws: "from-orange-400/20 to-amber-500/20 text-orange-300 border-orange-400/30",
  vue: "from-green-400/20 to-emerald-500/20 text-green-300 border-green-400/30",
  angular: "from-red-400/20 to-rose-500/20 text-red-300 border-red-400/30",
  rust: "from-orange-400/20 to-amber-500/20 text-orange-300 border-orange-400/30",
  go: "from-cyan-400/20 to-blue-500/20 text-cyan-300 border-cyan-400/30",
}
const DEFAULT_TINT_DARK =
  "from-primary/20 to-primary/10 text-primary border-primary/30"
const DEFAULT_TINT_LIGHT =
  "from-primary/15 to-primary/5 text-primary border-primary/30"

function skillTint(name, isDark) {
  if (!name) return isDark ? DEFAULT_TINT_DARK : DEFAULT_TINT_LIGHT
  const key = name.toLowerCase().trim()
  if (SKILL_TINTS[key]) return SKILL_TINTS[key]
  // Try matching the first word for "NodeJs" / "NextJs" style entries.
  const first = key.split(/\s|\./)[0]
  if (SKILL_TINTS[first]) return SKILL_TINTS[first]
  return isDark ? DEFAULT_TINT_DARK : DEFAULT_TINT_LIGHT
}

// Modern template — striking hero, glass-morphic cards, animated skill pills,
// gradient project covers. Designed to feel like a polished developer site.
export default function ModernTemplate({ data }) {
  const { portfolio, user, profile, skills = [], projects = [] } = data || {}
  const theme = portfolio?.theme === "light" ? "light" : "dark"
  const isDark = theme === "dark"
  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const aboutText = portfolio?.about || profile?.bio || ""
  const showAbout = portfolio?.showAbout !== false
  const showSkills = portfolio?.showSkills !== false
  const showProjects = portfolio?.showProjects !== false

  // Color tokens driven by theme
  const c = isDark
    ? {
        page: "bg-zinc-950 text-zinc-100",
        muted: "text-zinc-400",
        hairline: "border-zinc-800/80",
        card: "bg-zinc-900/60 backdrop-blur-xl border-zinc-800/80",
        softCard: "bg-zinc-900/40 border-zinc-800/60",
        chip: "bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:text-zinc-100",
        accentText: "text-zinc-100",
      }
    : {
        page: "bg-zinc-50 text-zinc-900",
        muted: "text-zinc-500",
        hairline: "border-zinc-200",
        card: "bg-white/80 backdrop-blur-xl border-zinc-200",
        softCard: "bg-white/60 border-zinc-200/80",
        chip: "bg-white/80 border-zinc-200 text-zinc-700 hover:text-zinc-900",
        accentText: "text-zinc-900",
      }

  return (
    <div data-theme={theme} className={`min-h-full ${c.page} font-sans`}>
      {/* HERO */}
      <section
        className={`relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
            : "bg-gradient-to-br from-white via-zinc-50 to-white"
        }`}
      >
        {/* Decorative gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 size-[420px] rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 size-[380px] rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-500/15 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 size-[300px] -translate-x-1/2 rounded-full bg-gradient-to-t from-primary/20 to-transparent blur-3xl"
        />

        {/* Subtle grid */}
        <div
          aria-hidden
          className={`absolute inset-0 opacity-[0.04] [background-image:linear-gradient(${isDark ? "#fff" : "#000"})_1px,transparent_1px,linear-gradient(90deg,${isDark ? "#fff" : "#000"})_1px,transparent_1px] [background-size:48px_48px]`}
        />

        <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-20">
          {/* Status pill */}
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                isDark
                  ? "border-zinc-700/80 bg-zinc-900/60 text-zinc-300"
                  : "border-zinc-200 bg-white/70 text-zinc-600"
              } backdrop-blur`}
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Available for opportunities
            </span>
          </div>

          {/* Avatar with glow ring */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-full bg-gradient-to-tr from-violet-500/40 via-fuchsia-500/40 to-cyan-400/40 blur-xl"
              />
              <Avatar
                className={`relative size-28 ring-4 ring-offset-4 ${
                  isDark ? "ring-zinc-950 ring-offset-zinc-950" : "ring-white ring-offset-white"
                }`}
              >
                <AvatarImage src={profile?.image} alt={user?.name} />
                <AvatarFallback
                  className={`text-2xl font-semibold ${
                    isDark
                      ? "bg-zinc-800 text-zinc-100"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Name + headline */}
          <div className="mt-6 text-center">
            <h1
              className={`text-4xl sm:text-5xl font-bold tracking-tight ${c.accentText}`}
            >
              {user?.name || "Your Name"}
            </h1>
            {portfolio?.headline ? (
              <p
                className={`mt-3 text-base sm:text-lg ${c.muted} max-w-2xl mx-auto`}
              >
                {portfolio.headline}
              </p>
            ) : null}
            {profile?.location ? (
              <p
                className={`mt-2 inline-flex items-center gap-1.5 text-sm ${c.muted}`}
              >
                <MapPin className="size-3.5" />
                {profile.location}
              </p>
            ) : null}
          </div>

          {/* Social + CTA */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {profile?.github ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className={`rounded-full ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800"
                    : "border-zinc-300 bg-white/70 hover:bg-white"
                }`}
              >
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <LinkIcon className="size-3.5" />
                  GitHub
                </a>
              </Button>
            ) : null}
            {profile?.linkedin ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className={`rounded-full ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800"
                    : "border-zinc-300 bg-white/70 hover:bg-white"
                }`}
              >
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <LinkIcon className="size-3.5" />
                  LinkedIn
                </a>
              </Button>
            ) : null}
            {user?.email ? (
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90"
              >
                <a href={`mailto:${user.email}`}>
                  <Send className="size-3.5" />
                  Get in touch
                </a>
              </Button>
            ) : null}
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
            <Stat
              icon={<Code2 className="size-4" />}
              label="Skills"
              value={skills.length}
              isDark={isDark}
            />
            <Stat
              icon={<Rocket className="size-4" />}
              label="Projects"
              value={projects.length}
              isDark={isDark}
            />
            <Stat
              icon={<Wrench className="size-4" />}
              label="Building with"
              value={skills.slice(0, 3).map((s) => s.name).join(" · ") || "—"}
              isDark={isDark}
              small
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-20">
        {/* About */}
        {showAbout ? (
          <section id="about">
            <SectionHeader
              eyebrow="About"
              title="Who I am"
              isDark={isDark}
              icon={<Sparkles className="size-3.5" />}
            />
            <Card className={`mt-5 ${c.card}`}>
              <CardContent
                className={`text-base sm:text-lg leading-relaxed whitespace-pre-line ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
              >
                {aboutText || "No bio yet — add one in your profile."}
              </CardContent>
            </Card>
          </section>
        ) : null}

        {/* Skills */}
        {showSkills && skills.length > 0 ? (
          <section id="skills">
            <SectionHeader
              eyebrow="Toolkit"
              title="What I work with"
              isDark={isDark}
            />
            <div className="mt-6 flex flex-wrap gap-2.5">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className={`group inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${skillTint(
                    s.name,
                    isDark
                  )}`}
                >
                  <span className="inline-block size-1.5 rounded-full bg-current opacity-70 group-hover:opacity-100" />
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Projects */}
        {showProjects && projects.length > 0 ? (
          <section id="projects">
            <SectionHeader
              eyebrow="Work"
              title="Selected projects"
              isDark={isDark}
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  isDark={isDark}
                />
              ))}
            </div>
          </section>
        ) : null}

        <footer
          className={`border-t ${c.hairline} pt-8 text-center text-xs ${c.muted}`}
        >
          Crafted with SkillDev
        </footer>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, isDark, small = false }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-4 text-center backdrop-blur transition-colors ${
        isDark
          ? "border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80"
          : "border-zinc-200 bg-white/70 hover:bg-white"
      }`}
    >
      <div
        className={`mx-auto inline-flex items-center justify-center gap-1.5 text-xs font-medium ${
          isDark ? "text-zinc-400" : "text-zinc-500"
        }`}
      >
        {icon}
        {label}
      </div>
      <div
        className={`mt-1.5 font-semibold ${
          small ? "text-sm" : "text-2xl"
        } ${isDark ? "text-zinc-100" : "text-zinc-900"} truncate`}
      >
        {value}
      </div>
    </div>
  )
}

function SectionHeader({ eyebrow, title, icon, isDark }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-zinc-800/40 pb-3">
      <div>
        <p
          className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
            isDark ? "text-violet-300" : "text-violet-600"
          }`}
        >
          {icon}
          {eyebrow}
        </p>
        <h2
          className={`mt-1 text-2xl sm:text-3xl font-bold tracking-tight ${
            isDark ? "text-zinc-50" : "text-zinc-900"
          }`}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, isDark }) {
  const gradPair = [
    "from-violet-500/30 via-fuchsia-500/20 to-cyan-400/20",
    "from-amber-400/30 via-orange-500/20 to-rose-500/20",
    "from-emerald-400/30 via-teal-500/20 to-cyan-400/20",
    "from-sky-400/30 via-blue-500/20 to-indigo-500/20",
    "from-rose-400/30 via-pink-500/20 to-violet-500/20",
    "from-lime-400/30 via-emerald-500/20 to-teal-400/20",
  ]
  const grad = gradPair[index % gradPair.length]
  const techs = (project.techStack || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5)

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isDark
          ? "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900/80"
          : "border-zinc-200 bg-white/80 hover:border-zinc-300 hover:bg-white"
      } backdrop-blur`}
    >
      {/* Cover */}
      <div
        className={`relative h-32 overflow-hidden bg-gradient-to-br ${grad}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.25),transparent_40%)]"
        />
        <div className="absolute inset-0 flex items-end p-4">
          <h3
            className={`text-lg font-semibold leading-snug ${
              isDark ? "text-white" : "text-zinc-900"
            } line-clamp-2 drop-shadow`}
          >
            {project.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        {project.description ? (
          <p
            className={`text-sm leading-relaxed line-clamp-3 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            {project.description}
          </p>
        ) : null}

        {techs.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className={`rounded-full text-xs font-normal ${
                  isDark
                    ? "border-zinc-700 bg-zinc-800/60 text-zinc-300"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600"
                }`}
              >
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-2">
          {project.githubUrl ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className={`rounded-full ${
                isDark
                  ? "border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <LinkIcon className="size-3.5" />
                Code
              </a>
            </Button>
          ) : null}
          {project.liveUrl ? (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90"
            >
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Live demo
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
