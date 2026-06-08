"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import {
  getProjects,
  createProject,
  deleteProject,
} from "@/services/project.service"
import useAuthStore from "@/store/auth.store"

export default function ProjectsPage() {
  const router = useRouter()
  const authUser = useAuthStore((state) => state.user)

  const [projects, setProjects] = useState([])
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    techStack: "",
  })

  const fetchProjects = async () => {
    const data = await getProjects()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreate = async () => {
    try {
      const persistedUser =
        typeof window !== "undefined"
          ? localStorage.getItem("user")
          : null

      const localUser = persistedUser
        ? JSON.parse(persistedUser)
        : null
      const user = authUser ?? localUser

      if (!user) {
        setMessage("Please log in to create a project.")
        router.push("/login")
        return
      }

      await createProject({
        ...formData,
        userId: user.id,
      })

      fetchProjects()
    } catch (error) {
      console.log(error.response?.data)
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    await deleteProject(id)
    fetchProjects()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-4xl font-bold">
          Projects
        </h1>

        {message && (
          <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            {message}
          </p>
        )}

        {/* Add Project */}

        <Card>
          <CardContent className="p-6 space-y-4">

            <div>
              <Label>Project Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>GitHub URL</Label>
              <Input
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Live URL (Optional)</Label>
              <Input
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Tech Stack</Label>
              <Input
                name="techStack"
                placeholder="Next.js, Prisma, PostgreSQL"
                value={formData.techStack}
                onChange={handleChange}
              />
            </div>

            <Button onClick={handleCreate}>
              Add Project
            </Button>

          </CardContent>
        </Card>

        {/* Projects List */}

        <div className="grid md:grid-cols-2 gap-6">

          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">

                <h2 className="text-xl font-bold">
                  {project.title}
                </h2>

                <p className="text-muted-foreground mt-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStack
                    ?.split(",")
                    .map((tech) => (
                      <Badge key={tech}>
                        {tech.trim()}
                      </Badge>
                    ))}
                </div>

                <div className="flex gap-3 mt-5">

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                    >
                      <Button size="sm">
                        GitHub
                      </Button>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                    >
                      <Button size="sm">
                        Live Demo
                      </Button>
                    </a>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleDelete(project.id)
                    }
                  >
                    Delete
                  </Button>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>

      </div>
    </div>
  )
}