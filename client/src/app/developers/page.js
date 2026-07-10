

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Search as SearchIcon, Loader2, Code2, FolderGit2, ArrowRight } from "lucide-react"
import { getUsers } from "@/services/user.service"
import AppShell from "@/components/AppShell"

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-green-600",
  "from-orange-500 to-amber-600",
  "from-pink-500 to-rose-600",
  "from-blue-500 to-indigo-600",
]

function initialsOf(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"
}

export default function DevelopersPage() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Failed to load developers"))
      .finally(() => setLoading(false))
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = !q
    ? users
    : users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.skills?.some((s) => s.name.toLowerCase().includes(q))
      )

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-7 h-7 text-cyan-400" />
            Developers
          </h1>
          <p className="text-muted-foreground mt-1">Explore other developers and their skills. Click a name to view their full profile.</p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            id="developer-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or skill e.g. Alex, React, Python..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {q ? `No developers match "${query}".` : "No developers found yet."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((u, i) => (
              <Link
                key={u.id}
                href={`/developers/${u.id}`}
                className="rounded-2xl border border-border/50 bg-card p-5 card-hover flex flex-col gap-4 group"
              >
                <div className="flex items-center gap-3">
                  {u.image ? (
                    <img src={u.image} alt={u.name} className="w-12 h-12 rounded-xl object-cover border border-border/50 shrink-0" />
                  ) : (
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {initialsOf(u.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-sm truncate group-hover:text-primary transition-colors flex items-center gap-1">
                      {u.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h2>
                    <p className="text-muted-foreground text-xs truncate">{u.email}</p>
                  </div>
                </div>

                {u.bio && <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{u.bio}</p>}

                {u.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {u.skills.slice(0, 6).map((s) => (
                      <span key={s.id} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{s.name}</span>
                    ))}
                    {u.skills.length > 6 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border/50">+{u.skills.length - 6}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground/60 text-xs italic">No skills listed yet</p>
                )}

                <div className="mt-auto flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" />{u.skills?.length || 0} skills</span>
                  <span className="flex items-center gap-1.5"><FolderGit2 className="w-3.5 h-3.5" />{u.projectCount || 0} projects</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
