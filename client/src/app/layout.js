import { Inter } from "next/font/google"
import "./globals.css"

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

// Runs before first paint to apply the saved theme and avoid a flash of the
// wrong colors. Defaults to dark when nothing is stored.
const themeScript = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light") document.documentElement.classList.add("dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
