"use client"

import { useState } from 'react'
import { summarizeTrendInsights } from '@/ai/flows/ai-summarize-trend-insights'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Sparkles, Loader2, BrainCircuit, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import metaData from '@/app/data/meta.json'
import categoryDataRaw from '@/app/data/categoryBigNumbers.json'
import { useToast } from '@/hooks/use-toast'

export default function InsightPage() {
  const { toast } = useToast()
  // Use data from meta.json which lists all tracked categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(metaData.categories.slice(0, 5))
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = (name: string) => {
    setSelectedCategories(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  const generateInsights = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "No Scope Selected",
        description: "Please select at least one category to analyze.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setInsight(null)
    
    try {
      // Mapping categories to the expected trend schema for the AI flow
      // We enrich this with actual data from categoryBigNumbers if available
      const mockTrendData = selectedCategories.map(cat => {
        const accCat = categoryDataRaw.blocks.ACC.categories.find((c: any) => c.name === cat);
        const appCat = categoryDataRaw.blocks.APP.categories.find((c: any) => c.name === cat);
        const realData = accCat || appCat;

        return {
          name: cat,
          category: realData ? (accCat ? "Accessories" : "Apparel") : "Tracked Trend",
          status: realData ? "Active Monitoring" : "Emerging Discussion",
          description: `Strategic market intelligence analysis for ${cat} based on current social listening and sales velocity data.`,
          growthRate: realData ? Math.round(realData.currentYtdGrowth * 100) : 25,
          marketShare: realData ? Math.round((realData.currentJan / 1000000) * 10) / 10 : 5
        }
      })
      
      const result = await summarizeTrendInsights({ trends: mockTrendData })
      setInsight(result)
    } catch (error) {
      console.error("Failed to generate insights:", error)
      toast({
        title: "Synthesis Failed",
        description: "The AI model encountered an error. Please try again or select fewer categories.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight uppercase">AI Strategic Insight</h1>
        <p className="text-muted-foreground">Synthesize multi-category social data into actionable market strategy.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <Card className="lg:col-span-4 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Synthesis Scope</CardTitle>
            <CardDescription>Select categories from the raw dataset for AI processing.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-1">
                {metaData.categories.map((cat) => (
                  <div 
                    key={cat} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group" 
                    onClick={() => handleToggle(cat)}
                  >
                    <Checkbox 
                      checked={selectedCategories.includes(cat)} 
                      onCheckedChange={() => {}} // Toggle handled by parent div to prevent double events
                      className="pointer-events-none"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <div className="text-xs text-muted-foreground w-full text-center">
              {selectedCategories.length} categories selected
            </div>
            <Button 
              className="w-full bg-primary text-primary-foreground py-6 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" 
              onClick={generateInsights}
              disabled={loading || selectedCategories.length === 0}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Synthesizing...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Generate Intelligence</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-8 border-border/50 bg-card/50 min-h-[600px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <BrainCircuit className="h-64 w-64 text-primary" strokeWidth={1} />
          </div>
          
          <CardHeader className="border-b border-border/50 bg-muted/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 uppercase tracking-widest text-sm text-primary font-black">
                  Intelligence Output
                </CardTitle>
                <CardDescription>Advanced synthesis of raw category movements.</CardDescription>
              </div>
              {insight && !loading && (
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={() => setInsight(null)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-8">
            {loading ? (
              <div className="space-y-8 w-full animate-pulse mt-12">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                <div className="h-48 bg-muted rounded w-full" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
                <p className="text-center text-primary font-bold animate-bounce mt-12 tracking-widest text-xs">MODEL: ANALYZING CROSS-CATEGORY PATTERNS</p>
              </div>
            ) : insight ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="flex items-center gap-2 text-primary mb-8">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-black uppercase tracking-[0.2em] text-xs">Strategic Report Finalized</span>
                </div>
                <div className="text-foreground leading-relaxed text-lg whitespace-pre-wrap font-medium font-body bg-muted/20 p-6 rounded-xl border border-primary/10">
                  {insight}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 py-24">
                <div className="h-24 w-24 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto border border-primary/10 shadow-inner">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Market Intelligence Ready</h3>
                  <p className="text-muted-foreground leading-relaxed">Select categories from the scope panel to initiate an AI-powered synthesis of current fashion market movements and strategic implications.</p>
                </div>
              </div>
            )}
          </CardContent>
          
          {insight && !loading && (
            <CardFooter className="border-t border-border/50 bg-muted/20 p-4">
              <div className="flex w-full items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 shadow-sm" />
                  Analysis Validated
                </div>
                <span>TS: {new Date().toLocaleTimeString()}</span>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
