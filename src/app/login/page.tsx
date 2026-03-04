"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Lock, User, AlertCircle } from 'lucide-react'
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#1F1A20]">
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src="https://picsum.photos/seed/fashion-login/1200/1200"
          alt="Fashion Editorial"
          fill
          className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
          priority
          data-ai-hint="fashion editorial"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A20] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-12 left-12 right-12">
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-4 uppercase">MLB Social Listening</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Deciphering the DNA of fashion trends through AI-powered social intelligence.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-[#1F1A20]">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white lg:hidden uppercase">MLB Social Listening</h2>
            <p className="text-muted-foreground">Welcome back. Enter your credentials to access the dashboard.</p>
          </div>

          <Card className="bg-card/30 border-white/5 backdrop-blur-sm shadow-2xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Authentication</CardTitle>
                <CardDescription>Secure access to trend intelligence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
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
                      placeholder="Enter username"
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
                      placeholder="Enter password"
                      className="pl-10 bg-background/50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6">
                  Initialize Session
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MLB Social Listening Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
