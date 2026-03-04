"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import categoryDataRaw from "@/app/data/categoryBigNumbers.json"
import configData from "@/app/data/config.json"
import { 
  TrendingUp, 
  Users, 
  Layers, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar as CalendarIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
  // Extract all available months from the data (assuming ACC and APP have same months)
  const availableMonths = categoryDataRaw.blocks.APP.months
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[availableMonths.length - 1])

  // Helper to get translation
  const getTranslation = (blockKey: string, categoryName: string) => {
    const blockConfig = configData.categoryOverviewConfigs.find(
      c => c.sheet === (blockKey === "ACC" ? "BAGS" : "PANTS") || c.sheet === blockKey
    )
    return blockConfig?.en?.[categoryName] || categoryName
  }

  const dashboardStats = useMemo(() => {
    const accBlock = categoryDataRaw.blocks.ACC
    const appBlock = categoryDataRaw.blocks.APP

    const accTotalForMonth = accBlock.totalSeries.find(s => s.month === selectedMonth)
    const appTotalForMonth = appBlock.totalSeries.find(s => s.month === selectedMonth)

    const totalBuzz = (accTotalForMonth?.value || 0) + (appTotalForMonth?.value || 0)
    
    // Average YoY for high-level (simplified)
    const avgYoY = (
      ((accTotalForMonth?.yoy || 0) + (appTotalForMonth?.yoy || 0)) / 2 * 100
    ).toFixed(1)

    const totalCategories = accBlock.categories.length + appBlock.categories.length - 2 // excluding 'ttl' entries

    // Find fastest growing category for the month across both blocks
    const allCats = [
      ...accBlock.categories.filter(c => c.name !== 'ttl').map(c => ({ ...c, block: 'ACC' })),
      ...appBlock.categories.filter(c => c.name !== 'ttl').map(c => ({ ...c, block: 'APP' }))
    ]

    const growths = allCats.map(cat => {
      const monthData = cat.series.find(s => s.month === selectedMonth)
      return {
        name: getTranslation(cat.block, cat.name),
        growth: monthData?.yoy ? (monthData.yoy * 100) : 0,
        buzz: monthData?.value || 0
      }
    })

    const fastestGrower = growths.reduce((prev, current) => (prev.growth > current.growth) ? prev : current)

    return {
      totalBuzz,
      avgYoY,
      totalCategories,
      fastestGrower,
      topGrowers: growths.sort((a, b) => b.growth - a.growth).slice(0, 5)
    }
  }, [selectedMonth])

  const stats = [
    { 
      label: "Aggregate Buzz", 
      value: `${(dashboardStats.totalBuzz / 1000000).toFixed(1)}M`, 
      change: `${dashboardStats.avgYoY}%`, 
      increasing: parseFloat(dashboardStats.avgYoY) >= 0, 
      icon: Layers,
      color: "text-primary"
    },
    { 
      label: "Tracked Categories", 
      value: dashboardStats.totalCategories, 
      change: "Stable", 
      increasing: true, 
      icon: Users,
      color: "text-secondary"
    },
    { 
      label: "Top Growth", 
      value: `${dashboardStats.fastestGrower.growth.toFixed(0)}%`, 
      change: dashboardStats.fastestGrower.name, 
      increasing: true, 
      icon: TrendingUp,
      color: "text-accent"
    },
    { 
      label: "Market Velocity", 
      value: "High", 
      change: "Active", 
      increasing: true, 
      icon: Zap,
      color: "text-yellow-500"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Pulse</h1>
          <p className="text-muted-foreground">High-level intelligence from {selectedMonth} dataset.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hidden sm:flex">Export Data</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50 transition-all hover:shadow-lg hover:shadow-primary/5">
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
                <span className="text-muted-foreground ml-1">indicator</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Category Momentum</CardTitle>
            <CardDescription>Top performing categories by YoY growth in {selectedMonth}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardStats.topGrowers.map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.buzz.toLocaleString()} buzz volume</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden hidden sm:block">
                      <div 
                        className={`h-full transition-all duration-1000 ${cat.growth >= 0 ? 'bg-primary' : 'bg-destructive'}`} 
                        style={{ width: `${Math.min(100, Math.abs(cat.growth))}%` }} 
                      />
                    </div>
                    <span className={`text-sm font-semibold ${cat.growth >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {cat.growth > 0 ? '+' : ''}{cat.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 bg-card/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap className="h-40 w-40 text-primary" strokeWidth={1} />
          </div>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Automated observations for {selectedMonth}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-semibold text-primary text-sm mb-1">Growth Leader</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {dashboardStats.fastestGrower.name} is showing explosive momentum at {dashboardStats.fastestGrower.growth.toFixed(1)}% YoY. High probability of retail saturation in coming cycles.
              </p>
            </div>
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
              <h4 className="font-semibold text-secondary text-sm mb-1">Buzz Concentration</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Total market conversation reached {(dashboardStats.totalBuzz / 1000000).toFixed(1)}M, indicating a {parseFloat(dashboardStats.avgYoY) > 0 ? 'expansion' : 'contraction'} in overall consumer interest.
              </p>
            </div>
            <div className="mt-4 p-4 border border-dashed rounded-lg border-muted-foreground/20 text-center">
              <p className="text-xs text-muted-foreground">Market intelligence analysis complete for {selectedMonth}.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
