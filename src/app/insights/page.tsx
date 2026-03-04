
"use client"

import { useState } from 'react'
import { FASHION_TRENDS } from '@/lib/mock-data'
import { summarizeTrendInsights } from '@/ai/flows/ai-summarize-trend-insights'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Sparkles, Loader2, BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function InsightsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(FASHION_TRENDS.slice(0, 3).map(t => t.id))
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const generateInsights = async () => {
    if (selectedIds.length === 0) return

    setLoading(true)
    try {
      const selectedTrends = FASHION_TRENDS.filter(t => selectedIds.includes(t.id))
      const result = await summarizeTrendInsights({ trends: selectedTrends })
      setInsight(result)
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">AI Trend Intelligence</h1>
        <p className="text-muted-foreground text-lg">Synthesize complex market data into actionable strategic insights.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-12 items-start">
        <Card className="md:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Select Input Data</CardTitle>
            <CardDescription>Choose trends for analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {FASHION_TRENDS.map((trend) => (
                  <div key={trend.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleToggle(trend.id)}>
                    <Checkbox checked={selectedIds.includes(trend.id)} onCheckedChange={() => handleToggle(trend.id)} />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{trend.name}</p>
                      <p className="text-xs text-muted-foreground">{trend.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <p className="text-xs text-center text-muted-foreground">
              {selectedIds.length} trends selected for synthesis
            </p>
            <Button 
              className="w-full bg-primary text-white py-6 text-base font-semibold shadow-lg shadow-primary/20" 
              onClick={generateInsights}
              disabled={loading || selectedIds.length === 0}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Generate Insights</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-8 border-border/50 bg-card/50 min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <BrainCircuit className="h-48 w-48 text-primary" strokeWidth={1} />
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Generated Synthesis
                </CardTitle>
                <CardDescription>AI-powered trend report</CardDescription>
              </div>
              {insight && !loading && (
                <Button variant="ghost" size="icon" onClick={() => setInsight(null)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
            {loading ? (
              <div className="space-y-6 w-full animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <p className="text-center text-primary font-medium animate-bounce mt-8">Synthesizing market patterns...</p>
              </div>
            ) : insight ? (
              <div className="prose prose-invert max-w-none w-full animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-2 text-primary mb-6">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold uppercase tracking-widest text-xs">Analysis Complete</span>
                </div>
                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {insight}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 max-w-sm py-12">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Synthesize</h3>
                  <p className="text-muted-foreground">Select fashion trends from the left and click 'Generate Insights' to start the AI analysis.</p>
                </div>
              </div>
            )}
          </CardContent>
          
          {insight && !loading && (
            <CardFooter className="border-t border-border/50 bg-muted/20 p-4">
              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Models Optimized
                </div>
                <span>Analysis timestamp: {new Date().toLocaleTimeString()}</span>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
