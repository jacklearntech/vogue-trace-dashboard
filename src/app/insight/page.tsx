"use client"

import { useState } from 'react'
import { summarizeTrendInsights } from '@/ai/flows/ai-summarize-trend-insights'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Sparkles, Loader2, BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import metaData from '@/app/data/meta.json'

export default function InsightPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(metaData.categories.slice(0, 5))
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = (name: string) => {
    setSelectedCategories(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  const generateInsights = async () => {
    if (selectedCategories.length === 0) return

    setLoading(true)
    try {
      // Mapping categories to the expected trend schema for the AI flow
      const mockTrendData = selectedCategories.map(cat => ({
        name: cat,
        category: "Fashion Trend",
        status: "Emerging",
        description: `Analysis of ${cat} based on current social listening data.`,
        growthRate: 25,
        marketShare: 5
      }))
      
      const result = await summarizeTrendInsights({ trends: mockTrendData })
      setInsight(result)
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Strategic Insights</h1>
        <p className="text-muted-foreground">Synthesize cross-category data into actionable market intelligence.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <Card className="lg:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Observation Scope</CardTitle>
            <CardDescription>Select tracked categories for synthesis.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {metaData.categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleToggle(cat)}>
                    <Checkbox checked={selectedCategories.includes(cat)} onCheckedChange={() => handleToggle(cat)} />
                    <span className="text-sm font-medium">{cat}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button 
              className="w-full bg-primary text-primary-foreground py-6 text-base font-semibold shadow-lg shadow-primary/10" 
              onClick={generateInsights}
              disabled={loading || selectedCategories.length === 0}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Generate Report</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-8 border-border/50 bg-card/50 min-h-[600px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <BrainCircuit className="h-48 w-48 text-primary" strokeWidth={1} />
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 uppercase tracking-widest text-sm text-primary">
                  Synthesized Intelligence
                </CardTitle>
              </div>
              {insight && !loading && (
                <Button variant="ghost" size="icon" onClick={() => setInsight(null)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-8">
            {loading ? (
              <div className="space-y-6 w-full animate-pulse mt-12">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <p className="text-center text-primary font-medium animate-bounce mt-8">Analyzing market patterns...</p>
              </div>
            ) : insight ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-2 text-primary mb-6">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Synthesis Complete</span>
                </div>
                <div className="text-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {insight}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-24">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">Select categories from the scope panel to generate an AI-powered strategic summary of the market trends.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
