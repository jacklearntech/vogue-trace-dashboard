
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FASHION_TRENDS } from "@/lib/mock-data"
import { 
  TrendingUp, 
  Users, 
  Layers, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const totalTrends = FASHION_TRENDS.length
  const activeCollections = Array.from(new Set(FASHION_TRENDS.flatMap(t => t.associatedCollections || []))).length
  const avgGrowth = Math.round(FASHION_TRENDS.reduce((acc, t) => acc + t.growthRate, 0) / totalTrends)
  const highImpactTrends = FASHION_TRENDS.filter(t => t.growthRate > 30).length

  const stats = [
    { 
      label: "Total Trends", 
      value: totalTrends, 
      change: "+12%", 
      increasing: true, 
      icon: Layers,
      color: "text-primary"
    },
    { 
      label: "Active Collections", 
      value: activeCollections, 
      change: "+5%", 
      increasing: true, 
      icon: Users,
      color: "text-secondary"
    },
    { 
      label: "Avg. Growth Rate", 
      value: `${avgGrowth}%`, 
      change: "+2.4%", 
      increasing: true, 
      icon: TrendingUp,
      color: "text-accent"
    },
    { 
      label: "High Impact", 
      value: highImpactTrends, 
      change: "-1%", 
      increasing: false, 
      icon: Zap,
      color: "text-yellow-500"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
          <p className="text-muted-foreground">Snapshot of current fashion intelligence metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">Export PDF</Button>
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Monitor
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 transition-all hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center gap-1 mt-1 text-xs">
                {stat.increasing ? (
                  <span className="flex items-center text-green-500 font-medium">
                    <ArrowUpRight className="h-3 w-3" /> {stat.change}
                  </span>
                ) : (
                  <span className="flex items-center text-destructive font-medium">
                    <ArrowDownRight className="h-3 w-3" /> {stat.change}
                  </span>
                )}
                <span className="text-muted-foreground">vs last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Fastest Growing Trends</CardTitle>
            <CardDescription>Trends with significant velocity in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {FASHION_TRENDS.sort((a, b) => b.growthRate - a.growthRate).slice(0, 4).map((trend) => (
                <div key={trend.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{trend.name}</p>
                    <p className="text-xs text-muted-foreground">{trend.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden hidden sm:block">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${Math.min(100, Math.max(0, trend.growthRate + 20))}%` }} 
                      />
                    </div>
                    <span className="text-sm font-semibold text-primary">{trend.growthRate}%</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" asChild className="mt-6 p-0 text-primary">
              <Link href="/trends">View all trends &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 bg-card/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap className="h-40 w-40 text-primary" strokeWidth={1} />
          </div>
          <CardHeader>
            <CardTitle>Actionable Insights</CardTitle>
            <CardDescription>AI-identified opportunities based on market shift.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-semibold text-primary text-sm mb-1">Saturation Alert</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Quiet Luxury" is approaching peak market share (22%). Predicted shift towards bold textures in Q4.
              </p>
            </div>
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
              <h4 className="font-semibold text-secondary text-sm mb-1">Emerging Synthesis</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Convergence of "Cyberpunk Utility" and "Neo-Gothic" accessories observed in underground digital showrooms.
              </p>
            </div>
            <Button className="w-full bg-secondary text-white hover:bg-secondary/90 mt-2" asChild>
              <Link href="/insights">Generate Custom Summary</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
