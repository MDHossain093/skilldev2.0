// Server Component (no "use client") — wraps next/script with the
// "beforeInteractive" strategy, which Next.js renders as a plain HTML
// <script> injected into the document head before hydration. This avoids
// both the React 19 "Encountered a script tag while rendering React
// component" error and the "removeChild" NotFoundError that fires when
// the React 19 compiler tries to reconcile a server-rendered <script>
// inside a client tree.
import Script from "next/script"

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light")document.documentElement.classList.add("dark");}catch(e){document.documentElement.classList.add("dark");}})();`

export default function ThemeInitScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  )
}
