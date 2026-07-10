"use client"

import { useEffect, useState } from "react"
import { Users, Sparkles, Loader2, Code2, BrainCircuit } from "lucide-react"
import useAuthStore from "@/store/auth.store"
import { getProfile } from "@/services/profile.service"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"
import { getRecommendedSkills } from "@/services/ai.service"
import AppShell from "@/components/AppShell"

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-green-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
]

function generateTeamSuggestions() {
  return [
    { id: 0, title: "Frontend Specialist", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"], bio: "Expert in building beautiful, performant user interfaces with modern React ecosystems.", gradient: AVATAR_COLORS[0], initials: "FS" },
    { id: 1, title: "Backend Engineer", skills: ["Node.js", "PostgreSQL", "Redis", "Docker"], bio: "Specialized in scalable APIs, database optimization, and cloud infrastructure.", gradient: AVATAR_COLORS[1], initials: "BE" },
    { id: 2, title: "AI/ML Engineer", skills: ["Python", "TensorFlow", "LangChain", "FastAPI"], bio: "Builds intelligent systems using the latest LLM and machine learning frameworks.", gradient: AVATAR_COLORS[2], initials: "AI" },
    { id: 3, title: "DevOps Engineer", skills: ["Kubernetes", "CI/CD", "AWS", "Terraform"], bio: "Streamlines deployment pipelines and ensures high availability at scale.", gradient: AVATAR_COLORS[3], initials: "DO" },
    { id: 4, title: "Mobile Developer", skills: ["React Native", "Expo", "Swift", "Kotlin"], bio: "Cross-platform mobile development with native performance on iOS and Android.", gradient: AVATAR_COLORS[4], initials: "MD" },
  ].slice(0, 3)
}

export default function TeamMatchPage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (user) {
      Promise.all([
        getProfile(user.id).then(setProfile),
        getSkills(user.id).then(setSkills),
        getProjects(user.id).then(setProjects),
      ]).then(() => setDataLoaded(true))
    }
  }, [user])

  const handleFindTeam = async () => {
    setLoading(true)
    try {
      const payload = {
        profile,
        skills: skills.map((s) => s.name),
        projects: projects.map((p) => ({ title: p.title, description: p.description, techStack: p.techStack })),
        targetRole: "",
      }
      const result = await getRecommendedSkills(payload)
      setRecommendedSkills(result?.recommendedSkills ?? [])
      setSuggestions(generateTeamSuggestions())
    } catch (err) {
      console.error(err)
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
          {skills.length === 0 ? (
            <p className="text-muted-foreground text-sm">No skills found. Add skills on the <a href="/skills" className="text-primary hover:underline">Skills page</a> first.</p>
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
          <p className="text-muted-foreground text-xs mt-3">AI analyzes your skills and suggests complementary team roles</p>
        </div>

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

        {suggestions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-5">Suggested Team Roles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggestions.map((member) => (
                <div key={member.id} className="rounded-2xl border border-border/50 bg-card p-5 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{member.initials}</div>
                    <div>
                      <h3 className="font-bold text-sm">{member.title}</h3>
                      <p className="text-xs text-muted-foreground">Complementary Role</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground border border-border/50">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
