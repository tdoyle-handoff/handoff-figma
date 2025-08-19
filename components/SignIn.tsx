import * as React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from './ui/utils'

export function SignIn({ className }: { className?: string }) {
  const auth = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      setIsSubmitting(true)
      // Minimal email-only auth: use your existing Google sign-in or guest as fallback.
      // If you later add email/password with Supabase, wire it here.
      await auth.handleGoogleSignIn()
    } catch (err) {
      /* handled in hook state */
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    try {
      setIsSubmitting(true)
      await auth.handleGoogleSignIn()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuest = () => {
    auth.continueAsGuest({
      buyerName: 'Guest User',
      buyerEmail: email || 'guest@handoff.demo',
    })
  }

  return (
    <div className={cn('min-h-screen w-full flex items-center justify-center bg-background px-4 py-8', className)}>
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle>Sign in to Handoff</CardTitle>
          <CardDescription>Use Google or continue as guest. Email/password coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled
              />
              <p className="text-xs text-muted-foreground">Password auth will be enabled after Supabase email auth is configured.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 grid gap-2">
            <Button type="button" variant="secondary" onClick={handleGoogle} disabled={isSubmitting}>
              Continue with Google
            </Button>
            <Button type="button" variant="ghost" onClick={handleGuest}>
              Continue as Guest
            </Button>
          </div>

          {auth.authError && (
            <div className="mt-4 text-sm text-destructive">
              {auth.authError}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
