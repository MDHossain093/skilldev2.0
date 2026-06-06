"use client"

import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  getSkills,
  createSkill,
  deleteSkill,
} from "@/services/skill.service"

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [skillName, setSkillName] = useState("")

  const fetchSkills = async () => {
    try {
      const data = await getSkills()
      setSkills(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleAddSkill = async () => {
    if (!skillName.trim()) return

    try {
      await createSkill({
        name: skillName,
      })

      setSkillName("")
      fetchSkills()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id)
      fetchSkills()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">

        <Card>
          <CardContent className="p-6">

            <h1 className="text-3xl font-bold mb-6">
              My Skills
            </h1>

            <div className="flex gap-3 mb-6">
              <Input
                placeholder="Enter a skill..."
                value={skillName}
                onChange={(e) =>
                  setSkillName(e.target.value)
                }
              />

              <Button onClick={handleAddSkill}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  className="cursor-pointer"
                  onClick={() =>
                    handleDelete(skill.id)
                  }
                >
                  {skill.name} ✕
                </Badge>
              ))}
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}