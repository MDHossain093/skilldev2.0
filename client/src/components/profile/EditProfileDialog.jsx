"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { updateProfile } from "@/services/profile.service"

export default function EditProfileDialog({
  userId,
  profile,
  onProfileUpdated,
}) {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    bio: profile?.bio || "",
    github: profile?.github || "",
    linkedin: profile?.linkedin || "",
    portfolio: profile?.portfolio || "",
    location: profile?.location || "",
    image: profile?.image || "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const updatedProfile =
        await updateProfile(userId, formData)

      onProfileUpdated(updatedProfile)

      setOpen(false)
    } catch (error) {
      console.log(error)
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <Label>Bio</Label>

            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <Label>GitHub</Label>

            <Input
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <Label>LinkedIn</Label>

            <Input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <Label>Portfolio</Label>

            <Input
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <Label>Location</Label>

            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bangladesh"
            />
          </div>

          <div>
            <Label>Avatar URL</Label>

            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}