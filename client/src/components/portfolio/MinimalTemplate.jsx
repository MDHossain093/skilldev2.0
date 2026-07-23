"use client"

import { ExternalLink, Link as LinkIcon, MapPin } from "lucide-react"

// Minimal template — restrained typography, one color accent, generous whitespace.
export default function MinimalTemplate({ data }) {
  const { portfolio, user, profile, skills = [], projects = [] } = data || {}
  const theme = portfolio?.theme === "light" ? "light" : "dark"
  const isDark = theme === "dark"

  const showAbout = portfolio?.showAbout !== false
  const showSkills = portfolio?.showSkills !== false
  const showProjects = portfolio?.showProjects !== false
  const accent = isDark ? "text-indigo-300" : "text-indigo-600"
  const accentHover = isDark ? "hover:text-indigo-300" : "hover:text-indigo-600"

  return (
    <div
      data-theme={theme}
      className={`min-h-full font-sans ${
        isDark ? "bg-zinc-950 text-zinc-300" : "bg-white text-zinc-700"
      }`}
    >
      <article className="mx-auto max-w-2xl px-6 py-20">
        {/* Accent line */}
        <div
          className={`mb-10 h-px w-16 bg-gradient-to-r ${
            isDark
              ? "from-indigo-400 to-transparent"
              : "from-indigo-500 to-transparent"
          }`}
        />

        <header>
          <h1
            className={`text-4xl sm:text-5xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {user?.name}
          </h1>

          {portfolio?.headline ? (
            <p
              className={`mt-4 text-lg sm:text-xl leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {portfolio.headline}
            </p>
          ) : null}

          {profile?.location ? (
            <p
              className={`mt-2 inline-flex items-center gap-1.5 text-sm ${
                isDark ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
              <MapPin className="size-3.5" />
              {profile.location}
            </p>
          ) : null}

          <div className="mt-5 flex items-center gap-5 text-sm">
            {profile?.github ? (
              <a
                className={`inline-flex items-center gap-1.5 opacity-80 transition-colors hover:opacity-100 ${accentHover}`}
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="size-3.5" />
                GitHub
              </a>
            ) : null}
            {profile?.linkedin ? (
              <a
                className={`inline-flex items-center gap-1.5 opacity-80 transition-colors hover:opacity-100 ${accentHover}`}
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="size-3.5" />
                LinkedIn
              </a>
            ) : null}
          </div>
        </header>

        <hr
          className={`my-12 ${
            isDark ? "border-zinc-800" : "border-zinc-200"
          }`}
        />

        {showAbout ? (
          <section>
            <SectionLabel label="About" accent={accent} />
            <p
              className={`mt-4 whitespace-pre-line text-base leading-loose ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {portfolio?.about || profile?.bio || "No bio yet."}
            </p>
          </section>
        ) : null}

        {showSkills && skills.length > 0 ? (
          <section className="mt-12">
            <SectionLabel label="Skills" accent={accent} />
            <p
              className={`mt-4 text-base leading-loose ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {skills.map((s) => s.name).join("  ·  ")}
            </p>
          </section>
        ) : null}

        {showProjects && projects.length > 0 ? (
          <section className="mt-12">
            <SectionLabel label="Projects" accent={accent} />
            <ul className="mt-4 space-y-8">
              {projects.map((p) => (
                <li key={p.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3
                      className={`text-lg font-semibold tracking-tight ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {p.title}
                    </h3>
                    <div className="flex shrink-0 gap-4 text-sm">
                      {p.githubUrl ? (
                        <a
                          className={`inline-flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100 ${accentHover}`}
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Code
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                      {p.liveUrl ? (
                        <a
                          className={`inline-flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100 ${accentHover}`}
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  {p.description ? (
                    <p
                      className={`mt-2 leading-relaxed ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {p.description}
                    </p>
                  ) : null}
                  {p.techStack ? (
                    <p
                      className={`mt-2 text-xs tracking-wide ${
                        isDark ? "text-zinc-500" : "text-zinc-500"
                      }`}
                    >
                      {p.techStack}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer
          className={`mt-20 text-xs ${
            isDark ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          Crafted with SkillDev
        </footer>
      </article>
    </div>
  )
}

function SectionLabel({ label, accent }) {
  return (
    <h2
      className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent}`}
    >
      {label}
    </h2>
  )
}
