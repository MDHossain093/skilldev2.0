/**
 * Normalize NEXT_PUBLIC_API_URL so it always points at the API root (no trailing /api).
 * Lets the env var be set either as `https://api.example.com` or `https://api.example.com/api`.
 */
export function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "")
}