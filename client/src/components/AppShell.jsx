"use client"

import Navbar from "@/components/Navbar"

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="lg:pl-64 pt-14 lg:pt-0">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
