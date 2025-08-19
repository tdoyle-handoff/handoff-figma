/* Auth configuration via Vite environment variables.
   Keep secrets in .env.local (not committed). */

// Required: project URL and anon key from env
export const projectUrl: string = import.meta.env.VITE_SUPABASE_URL as string
export const anonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Backwards-compatible alias (some modules import publicAnonKey)
export const publicAnonKey: string = anonKey

// Derived: project ref from URL (first subdomain segment)
export const projectRef: string = (() => {
  try {
    const url = new URL(projectUrl)
    const host = url.hostname // e.g., xxxxxx.supabase.co
    return host.split('.')[0]
  } catch {
    return ''
  }
})()
