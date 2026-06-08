"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Globe, Link, Mail, User, LogOut } from "lucide-react";

import useAuthStore from "@/store/auth.store";

export default function ProfilePage() {
  const router = useRouter();

  const { logout, user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      try {
        const persisted =
          typeof window !== "undefined" && localStorage.getItem("auth-storage");

        // If there's no persisted auth, redirect to login.
        if (!persisted) {
          router.push("/login");
        }
        // Otherwise wait for rehydration (do not redirect yet).
      } catch (e) {
        router.push("/login");
      }
    }
  }, [router, user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Developer Profile</h1>

            <p className="text-muted-foreground mt-2">
              Manage your developer identity
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full md:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Profile Card */}
          <Card className="lg:col-span-1 border-border shadow-xl">
            <CardContent className="p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold border border-primary/20">
                  {user.name?.charAt(0)}
                </div>

                <h2 className="text-2xl font-bold mt-4">{user.name}</h2>

                <p className="text-muted-foreground">Full Stack Developer</p>

                {/* AI Score */}
                <div className="mt-4">
                  <Badge className="px-4 py-1 text-sm">
                    AI Profile Score: 84%
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />

                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link className="w-5 h-5 text-primary" />

                  <span>{user.github || "github.com/username"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />

                  <span>{user.linkedin || "linkedin.com/in/user"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />

                  <span>
                    {user.bio ||
                      "Passionate developer building modern web applications."}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Overview */}
            <Card className="border-border shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Skills</h3>

                <div className="flex flex-wrap gap-3">
                  <Badge>React</Badge>
                  <Badge>Next.js</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>PostgreSQL</Badge>
                  <Badge>Prisma</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>LangChain</Badge>
                  <Badge>AI</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="border-border shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Projects</h3>

                  <Button
                    size="sm"
                    onClick={() => router.push("/projects")}
                  >
                    Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-muted/30">
                    <h4 className="font-semibold text-lg">SkillDev v2</h4>

                    <p className="text-muted-foreground mt-1">
                      AI-powered developer collaboration platform.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="secondary">Next.js</Badge>

                      <Badge variant="secondary">Express</Badge>

                      <Badge variant="secondary">PostgreSQL</Badge>

                      <Badge variant="secondary">LangChain</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendation */}
            <Card className="border-primary/20 shadow-xl bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">
                  AI Recommendation
                </h3>

                <p className="text-muted-foreground leading-7">
                  Focus on improving backend scalability and system design
                  skills. Building more collaborative AI projects will increase
                  your developer profile strength.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
