"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { loginUser } from "@/services/auth.service"
import useAuthStore from "@/store/auth.store"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      const data = await loginUser(formData)

      login(data.user, data.token)

      // Redirect
      router.push("/dashboard")

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">
              Welcome Back
            </h1>

            <p className="text-muted-foreground mt-2">
              Login to continue to SkillDev
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="cursor-pointer text-primary hover:underline"
            >
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}