"use client"

import { useEffect, useState } from "react"
import {
  BrainCircuit, Loader2, Sparkles, AlertTriangle, Lightbulb,
  Map, MessageSquare, Clock, CheckCircle2, XCircle,
} from "lucide-react"
import useAuthStore from "@/store/auth.store"
import { getProfile } from "@/services/profile.service"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"
import {
  getProfileAnalysis, getSkillGapAnalysis, getRecommendedSkills,
  getRoadmap, getCareerAdvice, getTimeline,
} from "@/services/ai.service"
import AppShell from "@/components/AppShell"

function AICard({ title, icon: Icon, iconColor, borderColor, description, onRun, loading, error, children }) {
  return (
    <div className={`rounded-2xl border ${borderColor} bg-card p-6 flex flex-col gap-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl bg-card border ${borderColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm">{title}</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
        </div>
      </div>

      <button
        onClick={onRun}
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
          loading
            ? "bg-secondary text-muted-foreground cursor-not-allowed"
            : "bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25"
        }`}
      >
        {loading ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
        ) : (
          <><Sparkles className="w-3.5 h-3.5" /> Run Analysis</>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/25">
          <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {children}
    </div>
  )
}

function TagList({ items, color }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>{item}</span>
      ))}
    </div>
  )
}

export default function AIPage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [targetRole, setTargetRole] = useState("")
  const [dataReady, setDataReady] = useState(false)

  const [results, setResults] = useState({})
  const [loadings, setLoadings] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      Promise.all([
        getProfile(user.id).then(setProfile),
        getSkills(user.id).then(setSkills),
        getProjects(user.id).then(setProjects),
      ]).then(() => setDataReady(true))
    }
  }, [user])

  // Cards that can't produce a meaningful result without a target role.
  const roleRequired = ["skillGap", "roadmap", "timeline"]

  const run = async (key, fn) => {
    if (roleRequired.includes(key) && !targetRole.trim()) {
      setErrors((e) => ({
        ...e,
        [key]: "Please enter a target role above first.",
      }))
      document.getElementById("target-role-input")?.focus()
      return
    }

    setLoadings((l) => ({ ...l, [key]: true }))
    setErrors((e) => ({ ...e, [key]: null }))
    try {
      const payload = {
        profile,
        skills: skills.map((s) => s.name),
        projects: projects.map((p) => ({ title: p.title, description: p.description, techStack: p.techStack })),
        targetRole,
      }
      const result = await fn(payload)
      setResults((r) => ({ ...r, [key]: result }))
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Analysis failed. Please try again."
      setErrors((e) => ({ ...e, [key]: msg }))
    } finally {
      setLoadings((l) => ({ ...l, [key]: false }))
    }
  }

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BrainCircuit className="w-7 h-7 text-violet-400" />
            AI Mentor
          </h1>
          <p className="text-muted-foreground mt-1">Get personalized AI-powered career analysis based on your profile</p>
        </div>

        {!dataReady && (
          <div className="flex items-center justify-center py-6 gap-3 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading your profile data...
          </div>
        )}

        {/* Target Role */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <label className="text-sm font-semibold block mb-2">
            🎯 Target Role{" "}
            <span className="font-normal text-muted-foreground text-xs">(required for Roadmap, Timeline, Skill Gap)</span>
          </label>
          <input
            id="target-role-input"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Backend Engineer, AI Engineer, Full Stack Developer..."
            className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
          {skills.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Analyzing based on <span className="text-primary font-medium">{skills.length} skills</span> and <span className="text-primary font-medium">{projects.length} projects</span> in your profile.
            </p>
          )}
        </div>

        {/* AI Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Profile Analysis */}
          <AICard
            title="Profile Analysis"
            icon={Sparkles}
            iconColor="text-violet-400"
            borderColor="border-violet-500/20"
            description="Identify your strengths and areas to improve as a developer"
            onRun={() => run("profileAnalysis", getProfileAnalysis)}
            loading={loadings.profileAnalysis}
            error={errors.profileAnalysis}
          >
            {results.profileAnalysis && (
              <div className="space-y-4">
                {results.profileAnalysis.strengths?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Strengths</span>
                    </div>
                    <TagList items={results.profileAnalysis.strengths} color="border-emerald-500/25 bg-emerald-500/10 text-emerald-300" />
                  </div>
                )}
                {results.profileAnalysis.weaknesses?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">Areas to Improve</span>
                    </div>
                    <TagList items={results.profileAnalysis.weaknesses} color="border-amber-500/25 bg-amber-500/10 text-amber-300" />
                  </div>
                )}
              </div>
            )}
          </AICard>

          {/* Skill Gap */}
          <AICard
            title="Skill Gap Analysis"
            icon={AlertTriangle}
            iconColor="text-orange-400"
            borderColor="border-orange-500/20"
            description="Discover skills you're missing for your target role"
            onRun={() => run("skillGap", getSkillGapAnalysis)}
            loading={loadings.skillGap}
            error={errors.skillGap}
          >
            {results.skillGap?.skillGaps?.length > 0 && (
              <TagList items={results.skillGap.skillGaps} color="border-orange-500/25 bg-orange-500/10 text-orange-300" />
            )}
          </AICard>

          {/* Recommended Skills */}
          <AICard
            title="Skill Recommendations"
            icon={Lightbulb}
            iconColor="text-cyan-400"
            borderColor="border-cyan-500/20"
            description="AI-curated skills to learn next based on your stack"
            onRun={() => run("recommendedSkills", getRecommendedSkills)}
            loading={loadings.recommendedSkills}
            error={errors.recommendedSkills}
          >
            {results.recommendedSkills?.recommendedSkills?.length > 0 && (
              <TagList items={results.recommendedSkills.recommendedSkills} color="border-cyan-500/25 bg-cyan-500/10 text-cyan-300" />
            )}
          </AICard>

          {/* Roadmap */}
          <AICard
            title="Career Roadmap"
            icon={Map}
            iconColor="text-emerald-400"
            borderColor="border-emerald-500/20"
            description="Step-by-step roadmap to reach your target role"
            onRun={() => run("roadmap", getRoadmap)}
            loading={loadings.roadmap}
            error={errors.roadmap}
          >
            {results.roadmap?.roadmap?.length > 0 && (
              <ol className="space-y-2">
                {results.roadmap.roadmap.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400 mt-0.5">{i + 1}</span>
                    <span className="text-muted-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </AICard>

          {/* Career Advice */}
          <AICard
            title="Career Advice"
            icon={MessageSquare}
            iconColor="text-pink-400"
            borderColor="border-pink-500/20"
            description="Personalized career guidance from your AI mentor"
            onRun={() => run("careerAdvice", getCareerAdvice)}
            loading={loadings.careerAdvice}
            error={errors.careerAdvice}
          >
            {results.careerAdvice?.careerAdvice && (
              <div className="rounded-xl bg-pink-500/5 border border-pink-500/15 p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{results.careerAdvice.careerAdvice}</p>
              </div>
            )}
          </AICard>

          {/* Timeline */}
          <AICard
            title="Timeline Estimator"
            icon={Clock}
            iconColor="text-blue-400"
            borderColor="border-blue-500/20"
            description="Realistic timeline to achieve your career goal"
            onRun={() => run("timeline", getTimeline)}
            loading={loadings.timeline}
            error={errors.timeline}
          >
            {results.timeline?.timeline && (
              <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4 flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{results.timeline.timeline}</p>
              </div>
            )}
          </AICard>
        </div>
      </div>
    </AppShell>
  )
}
