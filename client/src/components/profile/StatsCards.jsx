"use client"

import { Card, CardContent } from "@/components/ui/card"

import {
  FolderGit2,
  Code2,
  Sparkles,
} from "lucide-react"

export default function StatsCards({
  projectsCount,
  skillsCount,
  completion,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Projects
            </p>

            <h2 className="text-3xl font-bold">
              {projectsCount}
            </h2>
          </div>

          <FolderGit2 className="w-8 h-8 text-primary" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Skills
            </p>

            <h2 className="text-3xl font-bold">
              {skillsCount}
            </h2>
          </div>

          <Code2 className="w-8 h-8 text-primary" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Completion
            </p>

            <h2 className="text-3xl font-bold">
              {completion}%
            </h2>
          </div>

          <Sparkles className="w-8 h-8 text-primary" />
        </CardContent>
      </Card>

    </div>
  )
}