
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import categoryDataRaw from "@/app/data/categoryBigNumbers.json"
import configData from "@/app/data/config.json"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const COLORS = ['#A05BED', '#7380FF', '#1F1A20', '#4A434D', '#C084FC', '#818CF8'];

export default function AnalyticsPage() {
  const [activeBlock, setActiveBlock] = useState<"ACC" | "APP">("APP")
  
  // Type the imported JSON data roughly for internal use
  const blocks = categoryDataRaw.blocks as any
  const currentBlock = blocks[activeBlock]
  
  // Find translation config for English labels
  const blockConfig = configData.categoryOverviewConfigs.find(
    c => c.sheet === (activeBlock === "ACC" ? "BAGS" : "PANTS") || c.sheet === activeBlock
  )
  const translations = blockConfig?.en || {}

  const translate = (key: string) => translations[key] || key

  // Data for the Total Buzz Line Chart
  const totalBuzzData = useMemo(() => {
    return currentBlock.totalSeries.map((item: any) => ({
      month: item.month,
      buzz: item.value,
      yoy: (item.yoy * 100).toFixed(1)
    }))
  }, [currentBlock])

  // Data for the Category Distribution (Pie)
  const distributionData = useMemo(() => {
    return currentBlock.categories
      .filter((cat: any) => cat.name !== "ttl" && cat.name !== "TOTAL Buzz")
      .map((cat: any) => ({
        name: translate(cat.name),
        value: cat.currentJan || 0
      }))
  }, [currentBlock])

  // Data for Growth Rates (Bar)
  const growthData = useMemo(() => {
    return currentBlock.categories
      .filter((cat: any) => cat.name !== "ttl" && cat.name !== "TOTAL Buzz")
      .map((cat: any) => ({
        name: translate(cat.name),
        growth: (cat.currentYtdGrowth * 100).toFixed(1)
      }))
  }, [currentBlock])

  const chartConfig = {
    buzz: {
      label: "Buzz Volume",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
    growth: {
      label: "Growth %",
      theme: {
        light: "hsl(var(--secondary))",
        dark: "hsl(var(--secondary))",
      },
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Market Intelligence Analytics</h1>
          <p className="text-muted-foreground">Detailed performance analysis from raw category data.</p>
        </div>
        <Tabs value={activeBlock} onValueChange={(v) => setActiveBlock(v as any)} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="APP">Apparel</TabsTrigger>
            <TabsTrigger value="ACC">Accessories</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Aggregate Buzz Velocity</CardTitle>
            <CardDescription>Total monthly discussion volume for {activeBlock === "APP" ? "Apparel" : "Accessories"}.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ChartContainer config={chartConfig} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={totalBuzzData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => val.split('-')[1]}
                  />
                  <YAxis 
                    stroke="#888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="buzz" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Current Distribution</CardTitle>
            <CardDescription>Market share by sub-category (Jan 2026).</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="200">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F1A20', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(val: number) => val.toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-6 overflow-y-auto max-h-[100px]">
              {distributionData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-muted-foreground truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Year-to-Date Growth Comparison</CardTitle>
          <CardDescription>Percent growth for each tracked sub-category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="#888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                angle={-45} 
                textAnchor="end" 
              />
              <YAxis 
                stroke="#888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(160, 91, 237, 0.05)' }}
                contentStyle={{ backgroundColor: '#1F1A20', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                {growthData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={parseFloat(entry.growth) >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
