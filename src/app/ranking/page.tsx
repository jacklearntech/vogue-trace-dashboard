"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import categoryDataRaw from "@/app/data/categoryBigNumbers.json"
import configData from "@/app/data/config.json"
import { 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Zap,
  TrendingUp
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RankingPage() {
  const [activeBlock, setActiveBlock] = useState<"ACC" | "APP">("APP")
  const [search, setSearch] = useState("")
  
  const getTranslation = (blockKey: string, categoryName: string) => {
    const blockConfig = configData.categoryOverviewConfigs.find(
      c => c.sheet === (blockKey === "ACC" ? "BAGS" : "PANTS") || c.sheet === blockKey
    )
    return blockConfig?.en?.[categoryName] || categoryName
  }

  const rankingData = useMemo(() => {
    const block = categoryDataRaw.blocks[activeBlock]
    return block.categories
      .filter(c => c.name !== 'ttl' && c.name !== 'TOTAL Buzz')
      .map(c => ({
        id: c.name,
        name: getTranslation(activeBlock, c.name),
        buzz: c.currentJan || 0,
        growth: (c.currentYtdGrowth || 0) * 100,
        rawGrowth: c.currentYtdGrowth || 0
      }))
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.growth - a.growth)
  }, [activeBlock, search])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Leaderboard</h1>
            <p className="text-muted-foreground text-sm">Category rankings by growth velocity and consumer buzz.</p>
          </div>
        </div>
        <Tabs value={activeBlock} onValueChange={(v) => setActiveBlock(v as any)} className="w-full sm:w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="APP">Apparel</TabsTrigger>
            <TabsTrigger value="ACC">Accessories</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search categories..." 
            className="pl-10 bg-card/50 border-border/50 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {rankingData.map((item, index) => (
          <Card key={item.id} className="border-border/50 bg-card/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted font-bold text-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold truncate tracking-tight">{item.name}</h3>
                    {index === 0 && (
                      <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold uppercase tracking-wider px-2 py-0">
                        Top Performer
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      {item.buzz.toLocaleString()} Buzz
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      Ranked #{index + 1}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end gap-1 text-xl font-black ${item.growth >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {item.growth >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    {Math.abs(item.growth).toFixed(1)}%
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">YoY Velocity</p>
                </div>
              </div>
              <div className="h-1 w-full bg-muted overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${item.growth >= 0 ? 'bg-primary' : 'bg-destructive'}`} 
                  style={{ width: `${Math.min(100, Math.abs(item.growth))}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
