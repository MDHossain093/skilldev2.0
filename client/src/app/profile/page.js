"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import useAuthStore from "@/store/auth.store"

export default function ProfilePage() {
  const router = useRouter()

  const { logout } = useAuthStore()

  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user")

    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-border">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              
              {/* User Info */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold">
                  {user.name}
                </h1>

                <p className="text-muted-foreground">
                  {user.email}
                </p>

                <div className="space-y-2 pt-4">
                  <p>
                    <span className="font-semibold">
                      Bio:
                    </span>{" "}
                    {user.bio || "No bio added"}
                  </p>

                  <p>
                    <span className="font-semibold">
                      GitHub:
                    </span>{" "}
                    {user.github || "Not added"}
                  </p>

                  <p>
                    <span className="font-semibold">
                      LinkedIn:
                    </span>{" "}
                    {user.linkedin || "Not added"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() =>
                    router.push("/dashboard")
                  }
                >
                  Dashboard
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}