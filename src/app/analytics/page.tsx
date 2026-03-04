
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CATEGORY_STATS, GROWTH_DATA, FASHION_TRENDS } from "@/lib/mock-data"
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
  Line
} from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"

const COLORS = ['#A05BED', '#7380FF', '#1F1A20', '#4A434D'];

export default function AnalyticsPage() {
  const chartConfig = {
    value: {
      label: "Value",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
    rate: {
      label: "Growth Rate",
      theme: {
        light: "hsl(var(--secondary))",
        dark: "hsl(var(--secondary))",
      },
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Analytics</h1>
        <p className="text-muted-foreground">Deep dive into category distribution and growth velocities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Market share by trend category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F1A20', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {CATEGORY_STATS.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Growth Velocity</CardTitle>
            <CardDescription>Aggregate growth percentage over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ChartContainer config={chartConfig} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GROWTH_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
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
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Market Share Analysis</CardTitle>
          <CardDescription>Top trending movements ranked by current market penetration.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FASHION_TRENDS.sort((a,b) => b.marketShare - a.marketShare)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={60} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(160, 91, 237, 0.1)' }}
                contentStyle={{ backgroundColor: '#1F1A20', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="marketShare" radius={[4, 4, 0, 0]}>
                {FASHION_TRENDS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.growthRate > 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
