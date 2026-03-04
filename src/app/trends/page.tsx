
"use client"

import { useState } from 'react'
import { FASHION_TRENDS, Trend } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download,
  ExternalLink,
  ChevronDown
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function TrendsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredTrends = FASHION_TRENDS.filter(trend => {
    const matchesSearch = trend.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trend.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter ? trend.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Emerging': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Growing': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Mainstream': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'Declining': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return ''
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trends Catalog</h1>
          <p className="text-muted-foreground">Comprehensive database of tracked fashion movements.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-9 gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter by name or category..." 
                className="pl-10 bg-muted/30 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2">
                    <Filter className="h-4 w-4" /> 
                    {statusFilter || 'Status'}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Emerging')}>Emerging</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Growing')}>Growing</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Mainstream')}>Mainstream</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Declining')}>Declining</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[250px] font-semibold">Trend Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Growth</TableHead>
                <TableHead className="text-right font-semibold">Market Share</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrends.length > 0 ? (
                filteredTrends.map((trend) => (
                  <TableRow key={trend.id} className="hover:bg-muted/20 border-border/50 transition-colors cursor-pointer">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{trend.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{trend.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>{trend.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(trend.status)}>
                        {trend.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={trend.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {trend.growthRate > 0 ? '+' : ''}{trend.growthRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{trend.marketShare}%</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Compare Data</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Stop Tracking</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No trends found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
