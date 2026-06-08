"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

export default function AboutMeCard({ bio }) {
  return (
    <Card className="border-border shadow-xl">
      <CardContent className="p-6">
        
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          
          <h3 className="text-2xl font-semibold">
            About Me
          </h3>
        </div>

        <p className="text-muted-foreground leading-7">
          {bio?.trim()
            ? bio
            : "Tell the community about yourself. Share your interests, experience, goals, and what you're currently building."}
        </p>

      </CardContent>
    </Card>
  )
}