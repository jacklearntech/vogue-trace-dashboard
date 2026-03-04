"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Lock, User, AlertCircle, BarChart3 } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const success = login(username, password)
    if (!success) {
      setError('Invalid credentials. Hint: use test/test')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:block relative overflow-hidden bg-muted">
        <Image
          src="https://picsum.photos/seed/mlb-dashboard/1200/1200"
          alt="MLB Trends Editorial"
          fill
          className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          priority
          data-ai-hint="fashion sports"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-foreground uppercase">MLB Intelligence</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
            Harnessing social velocity and AI to decode the future of fashion trends.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground lg:hidden uppercase tracking-tight">MLB Social Listening</h2>
            <p className="text-muted-foreground">Secure Portal Access. Please enter your analyst credentials.</p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
                <CardDescription>Enter your username and password to proceed to the dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="analyst_name"
                      className="pl-10 bg-background/50"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-background/50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg transition-all active:scale-[0.98]">
                  Initialize Session
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} MLB Social Listening Dashboard</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span>Internal Use Only</span>
          </div>
        </div>
      </div>
    </div>
  )
}
