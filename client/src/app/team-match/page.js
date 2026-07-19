"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Sparkles, Loader2, Code2, BrainCircuit, FolderGit2 } from "lucide-react"
import useAuthStore from "@/store/auth.store"
import { getProfile } from "@/services/profile.service"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"
import { getTeamMatch } from "@/services/ai.service"
import AppShell from "@/components/AppShell"

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-green-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
]

const initialsOf = (name) =>
  (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default function TeamMatchPage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [matches, setMatches] = useState(null) // null = not searched yet
  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (user) {
      setLoadError(false)
      Promise.all([
        // A missing profile (404) is fine — the user just hasn't created one yet.
        getProfile(user.id).then(setProfile).catch((err) => {
          if (err?.response?.status !== 404) throw err
        }),
        getSkills(user.id).then(setSkills),
        getProjects(user.id).then(setProjects),
      ])
        .then(() => setDataLoaded(true))
        .catch((err) => {
          console.error(err)
          setLoadError(true)
        })
    }
  }, [user])

  const handleFindTeam = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getTeamMatch({
        userId: user?.id,
        profile,
        skills: skills.map((s) => s.name),
        projects: projects.map((p) => ({ title: p.title, description: p.description, techStack: p.techStack })),
      })
      setMatches(result?.matches ?? [])
      setRecommendedSkills(result?.recommendedSkills ?? [])
    } catch (err) {
      console.error(err)
      // Clear stale results from a previous successful search.
      setMatches(null)
      setRecommendedSkills([])
      setError(err?.response?.data?.message || "Something went wrong while finding your team. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="w-7 h-7 text-orange-400" />Team Match</h1>
          <p className="text-muted-foreground mt-1">Find developers who complement your skills for your next project</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-cyan-400" />Your Current Tech Stack</h2>
          {loadError ? (
            <p className="text-red-400 text-sm">Couldn&apos;t load your data. Make sure the server is running, then <button onClick={() => window.location.reload()} className="text-primary hover:underline">reload the page</button>.</p>
          ) : skills.length === 0 ? (
            <p className="text-muted-foreground text-sm">No skills found. Add skills on the <Link href="/skills" className="text-primary hover:underline">Skills page</Link> first.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{skill.name}</span>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            id="find-team-btn"
            onClick={handleFindTeam}
            disabled={loading || !dataLoaded || skills.length === 0}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Analyzing your profile...</> : <><BrainCircuit className="w-5 h-5" />Find My Ideal Team<Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /></>}
          </button>
          <p className="text-muted-foreground text-xs mt-3">AI matches you with real developers whose skills complement yours</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-400 text-center">{error}</div>
        )}

        {recommendedSkills.length > 0 && (
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" />Skills Your Team Should Cover</h2>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {matches !== null && matches.length === 0 && !loading && !error && (
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No matching developers found yet. Check back when more developers join the platform.</p>
          </div>
        )}

        {matches?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-5">Your Matched Teammates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((member, i) => (
                <Link
                  key={member.id}
                  href={`/developers/${member.id}`}
                  className="rounded-2xl border border-border/50 bg-card p-5 card-hover block hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {initialsOf(member.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate">{member.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{member.role || "Teammate"}</p>
                    </div>
                    {typeof member.matchScore === "number" && (
                      <span className="ml-auto shrink-0 px-2 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {member.matchScore}%
                      </span>
                    )}
                  </div>
                  {member.reason && <p className="text-muted-foreground text-xs leading-relaxed mb-4">{member.reason}</p>}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(member.skills ?? []).slice(0, 6).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground border border-border/50">{skill}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" />{member.projectCount ?? 0} project{member.projectCount === 1 ? "" : "s"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
