"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Mail,
  Globe,
  Link,
  MapPin,
  LogOut,
} from "lucide-react"

import useAuthStore from "@/store/auth.store"

import { getProfile } from "@/services/profile.service"
import { getSkills } from "@/services/skill.service"
import { getProjects } from "@/services/project.service"

import EditProfileDialog from "@/components/profile/EditProfileDialog"
import StatsCards from "@/components/profile/StatsCards"
import AboutMeCard from "@/components/profile/AboutMeCard"

export default function ProfilePage() {
  const router = useRouter()

  const { user, logout } = useAuthStore()

  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchProfile()
    fetchSkills()
    fetchProjects()
  }, [user])

  const fetchProfile = async () => {
    try {
      const data = await getProfile(user.id)
      setProfile(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSkills = async () => {
    try {
      const data = await getSkills()
      setSkills(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.log(error)
    }
  }

  const calculateCompletion = () => {
    if (!profile) return 0

    const fields = [
      profile.bio,
      profile.github,
      profile.linkedin,
      profile.portfolio,
      profile.location,
    ]

    const filled = fields.filter(Boolean).length

    return Math.round((filled / fields.length) * 100)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-4xl font-bold">
              Developer Profile
            </h1>

            <p className="text-muted-foreground mt-2">
              Manage your developer identity
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>

        </div>

        {/* Stats */}

        <StatsCards
          projectsCount={projects.length}
          skillsCount={skills.length}
          completion={calculateCompletion()}
        />

        {/* Main Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Profile */}

          <Card>
            <CardContent className="p-6">

              <div className="flex flex-col items-center text-center">

                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold">
                  {user.name?.charAt(0)}
                </div>

                <h2 className="text-2xl font-bold mt-4">
                  {user.name}
                </h2>

                <p className="text-muted-foreground">
                  {user.email}
                </p>

              </div>

              <div className="space-y-4 mt-8">

                {profile?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                {profile?.github && (
                  <div className="flex items-center gap-3">
                    <Link className="w-4 h-4" />
                    <span>{profile.github}</span>
                  </div>
                )}

                {profile?.linkedin && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4" />
                    <span>{profile.linkedin}</span>
                  </div>
                )}

              </div>

              <div className="mt-6">
                <EditProfileDialog
                  userId={user.id}
                  profile={profile}
                  onProfileUpdated={setProfile}
                />
              </div>

            </CardContent>
          </Card>

          {/* Right Side */}

          <div className="lg:col-span-2 space-y-6">

            <AboutMeCard
              bio={profile?.bio}
            />

            {/* Skills */}

            <Card>
              <CardContent className="p-6">

                <h3 className="text-xl font-bold mb-4">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {skills.length === 0 ? (
                    <p className="text-muted-foreground">
                      No skills added yet.
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <Badge key={skill.id}>
                        {skill.name}
                      </Badge>
                    ))
                  )}

                </div>

              </CardContent>
            </Card>

            {/* Projects */}

            <Card>
              <CardContent className="p-6">

                <h3 className="text-xl font-bold mb-4">
                  Projects
                </h3>

                <div className="space-y-4">

                  {projects.length === 0 ? (
                    <p className="text-muted-foreground">
                      No projects added yet.
                    </p>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="border rounded-lg p-4"
                      >
                        <h4 className="font-semibold">
                          {project.title}
                        </h4>

                        <p className="text-muted-foreground mt-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">

                          {project.techStack
                            ?.split(",")
                            .map((tech) => (
                              <Badge key={tech}>
                                {tech.trim()}
                              </Badge>
                            ))}

                        </div>

                      </div>
                    ))
                  )}

                </div>

              </CardContent>
            </Card>

            {/* AI Card */}

            <Card>
              <CardContent className="p-6">

                <h3 className="text-xl font-bold">
                  AI Recommendation
                </h3>

                <p className="text-muted-foreground mt-2">
                  Complete your profile and projects
                  to unlock personalized AI career
                  recommendations.
                </p>

                <Button
                  disabled
                  className="mt-4"
                >
                  Generate Roadmap
                </Button>

              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  )
}