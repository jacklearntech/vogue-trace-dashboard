"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import categoryDataRaw from "@/app/data/categoryBigNumbers.json"
import configData from "@/app/data/config.json"
import { 
  Trophy, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RankingPage() {
  const [activeBlock, setActiveBlock] = useState<"ACC" | "APP">("APP")
  const [search, setSearch] = useState("")
  
  const getTranslation = (categoryName: string) => {
    const blockConfig = configData.categoryOverviewConfigs.find(
      c => c.sheet === (activeBlock === "ACC" ? "BAGS" : "PANTS") || c.sheet === activeBlock
    )
    return blockConfig?.en?.[categoryName] || categoryName
  }

  const rankingData = useMemo(() => {
    const block = categoryDataRaw.blocks[activeBlock]
    return block.categories
      .filter(c => c.name !== 'ttl' && c.name !== 'TOTAL Buzz')
      .map(c => ({
        id: c.name,
        name: getTranslation(c.name),
        buzz: c.currentJan || 0,
        growth: (c.currentYtdGrowth || 0) * 100,
        lastYearGrowth: (c.lastYearYtd || 0) * 100
      }))
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.growth - a.growth)
  }, [activeBlock, search])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Rankings</h1>
          <p className="text-muted-foreground">Market velocity leaderboard based on year-to-date performance.</p>
        </div>
        <Tabs value={activeBlock} onValueChange={(v) => setActiveBlock(v as any)} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="APP">Apparel</TabsTrigger>
            <TabsTrigger value="ACC">Accessories</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Filter ranking..." 
          className="pl-10 bg-muted/50 border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {rankingData.map((item, index) => (
          <Card key={item.id} className="border-border/50 bg-card/50 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                    {index === 0 && <Badge className="bg-yellow-500/20 text-yellow-500 border-none">Growth Leader</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Monthly Buzz: {(item.buzz / 1000).toFixed(1)}K</p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end gap-1 text-lg font-bold ${item.growth >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {item.growth >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    {item.growth.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">YoY Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
