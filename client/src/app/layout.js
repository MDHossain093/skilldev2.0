import { Inter } from "next/font/google"
import "./globals.css"
import ThemeInitScript from "@/components/ThemeInitScript"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "SkillDev — AI-Powered Developer Career Platform",
  description:
    "Track your skills, showcase projects, and get AI-powered career guidance tailored for developers.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  )
}
