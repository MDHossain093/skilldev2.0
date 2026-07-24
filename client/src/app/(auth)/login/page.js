"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { loginUser } from "@/services/auth.service"
import useAuthStore from "@/store/auth.store"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      const data = await loginUser(formData)
      login(data.user, data.token)
      document.cookie = `token=${data.token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
      router.push("/dashboard")
      setTimeout(() => { if (window.location.pathname !== "/dashboard") window.location.href = "/dashboard" }, 300)
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/6 blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl border border-border/50 p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your SkillDev account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input id="login-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input id="login-password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full pl-10 pr-11 py-3 rounded-xl bg-secondary/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center justify-center w-4 h-4">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            </div>
            {error && <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>}
            <button id="login-submit" type="submit" disabled={loading} className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary/25 mt-2">
              <span className="flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><ArrowRight className="w-4 h-4" /><span>Sign In</span></>}
              </span>
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}