// Server Component (no "use client") so Next.js hoists this <script> into
// the <head> as a plain HTML element — avoids the Next 16 / React 19
// "Encountered a script tag while rendering React component" runtime error
// that fires for any <script> rendered inside a client component tree.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light")document.documentElement.classList.add("dark");}catch(e){document.documentElement.classList.add("dark");}})();`

export default function ThemeInitScript() {
  return (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  )
}
