import { useState, useEffect, useMemo, useCallback } from "react"
import { LeaderboardHeader } from "@/components/leaderboard-header"
import { TopPerformerCard } from "@/components/top-performer-card"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { Pagination } from "@/components/pagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { RankBadge } from "@/components/rank-badge"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface LeaderboardData {
  rank: number
  name: string
  overallScore: number
  maxScore: number
  phyScore: number
  chemScore: number
  mathsScore: number
  accuracy: number
  avatar?: string
  isCurrentUser?: boolean
}

export default function LeaderboardPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([])
  const [firstPageData, setFirstPageData] = useState<LeaderboardData[]>([]) // Store first page data for top cards
  const [allData, setAllData] = useState<LeaderboardData[]>([]) // Store all data for search
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState<'phy' | 'chem' | 'maths' | 'all'>("all")
  const [sortBy, setSortBy] = useState<'rank' | 'overall' | 'accuracy'>("rank")
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc")
  const [totalPages, setTotalPages] = useState(10)
  const [isSearchMode, setIsSearchMode] = useState(false)

  // Function to fetch all data for search
  const fetchAllData = async () => {
    try {
      const allResults: LeaderboardData[] = []
      
      // Fetch all pages (assuming 10 pages for now)
      for (let page = 1; page <= 10; page++) {
        const res = await fetch(`https://api.quizrr.in/api/hiring/leaderboard?page=${page}&limit=100`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })
        
        if (res.ok) {
          const json = await res.json()
          const list: any[] = (json?.data?.results ?? []) as any[]
          
          const mapped: LeaderboardData[] = list.map((item: any, idx: number) => {
            const subjects: any[] = Array.isArray(item.subjects) ? item.subjects : []
            const getScore = (label: string) => {
              const entry = subjects.find((s) =>
                String(s?.subjectId?.title ?? '').toLowerCase().includes(label),
              )
              return Number(entry?.totalMarkScored ?? 0)
            }
            return {
              rank: Number(item.rank ?? idx + 1),
              name: String(item?.userId?.name ?? "Unknown"),
              overallScore: Number(item.totalMarkScored ?? 0),
              maxScore: 300,
              phyScore: getScore("phys"),
              chemScore: getScore("chem"),
              mathsScore: getScore("math"),
              accuracy: Number(item.accuracy ?? 0),
              avatar: item?.userId?.profilePicture ?? undefined,
              isCurrentUser: false,
            }
          })
          
          allResults.push(...mapped)
        }
      }
      
      setAllData(allResults)
    } catch (err) {
      console.error("Error fetching all data:", err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const res = await fetch(`https://api.quizrr.in/api/hiring/leaderboard?page=${currentPage}&limit=100`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })
        
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Request failed: ${res.status} - ${errorText}`)
        }
        
        const json = await res.json()
        const list: any[] = (json?.data?.results ?? []) as any[]
        
        setTotalPages(10)
        
        const mapped: LeaderboardData[] = list.map((item: any, idx: number) => {
          const subjects: any[] = Array.isArray(item.subjects) ? item.subjects : []
          const getScore = (label: string) => {
            const entry = subjects.find((s) =>
              String(s?.subjectId?.title ?? '').toLowerCase().includes(label),
            )
            return Number(entry?.totalMarkScored ?? 0)
          }
          return {
            rank: Number(item.rank ?? idx + 1),
            name: String(item?.userId?.name ?? "Unknown"),
            overallScore: Number(item.totalMarkScored ?? 0),
            maxScore: 300,
            phyScore: getScore("phys"),
            chemScore: getScore("chem"),
            mathsScore: getScore("math"),
            accuracy: Number(item.accuracy ?? 0),
            avatar: item?.userId?.profilePicture ?? undefined,
            isCurrentUser: false,
          }
        })
        
        setLeaderboardData(mapped)
        
        if (currentPage === 1) {
          setFirstPageData(mapped)
        }
      } catch (err: any) {
        setError(`API Error: ${err?.message ?? "Failed to load data"}. Using mock data for demonstration.`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches
      setIsDesktop(matches)
    }
    onChange(mql)
    mql.addEventListener("change", onChange as any)
    return () => mql.removeEventListener("change", onChange as any)
  }, [])


  // Search and filter logic
  const filteredData = useMemo(() => {
    let data = isSearchMode ? allData : leaderboardData
    
    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.trim().toLowerCase()
      data = data.filter((item) => 
        item.name.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply subject filter
    if (subject !== 'all') {
      data = data.filter((item) => {
        if (subject === 'phy') return item.phyScore > 0
        if (subject === 'chem') return item.chemScore > 0
        if (subject === 'maths') return item.mathsScore > 0
        return true
      })
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let aValue, bValue
      if (subject === 'phy') {
        aValue = a.phyScore
        bValue = b.phyScore
      } else if (subject === 'chem') {
        aValue = a.chemScore
        bValue = b.chemScore
      } else if (subject === 'maths') {
        aValue = a.mathsScore
        bValue = b.mathsScore
      } else if (sortBy === 'rank') {
        aValue = a.rank
        bValue = b.rank
      } else if (sortBy === 'overall') {
        aValue = a.overallScore
        bValue = b.overallScore
      } else if (sortBy === 'accuracy') {
        aValue = a.accuracy
        bValue = b.accuracy
      } else {
        aValue = a.rank
        bValue = b.rank
      }
      
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue
    })
    
    return data
  }, [isSearchMode, query, allData, leaderboardData, subject, sortBy, sortDir])

  const topPerformers = useMemo(() => {
    if (isSearchMode) {
      return filteredData.slice(0, 3)
    }
    return firstPageData.slice(0, 3)
  }, [isSearchMode, filteredData, firstPageData])
  
  const pagedData = useMemo(() => {
    if (isSearchMode) {
      return filteredData
    }

    if (currentPage === 1 && isDesktop) {
      return leaderboardData.slice(3)
    }
    return leaderboardData
  }, [isSearchMode, filteredData, leaderboardData, currentPage, isDesktop])

  const currentUser = {
    rank: 73,
    name: "Prem Raj Kumar (You)",
    overallScore: 199,
    maxScore: 300,
    phyScore: 66,
    chemScore: 66,
    mathsScore: 67,
    accuracy: 80.3,
  }

  const doExport = useCallback(async () => {
    try {
      const allResults: LeaderboardData[] = []
      
      for (let page = 1; page <= 10; page++) {
        const res = await fetch(`https://api.quizrr.in/api/hiring/leaderboard?page=${page}&limit=100`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })
        
        if (res.ok) {
          const json = await res.json()
          const list: any[] = (json?.data?.results ?? []) as any[]
          
          const mapped: LeaderboardData[] = list.map((item: any, idx: number) => {
            const subjects: any[] = Array.isArray(item.subjects) ? item.subjects : []
            const getScore = (label: string) => {
              const entry = subjects.find((s) =>
                String(s?.subjectId?.title ?? '').toLowerCase().includes(label),
              )
              return Number(entry?.totalMarkScored ?? 0)
            }
            return {
              rank: Number(item.rank ?? idx + 1),
              name: String(item?.userId?.name ?? "Unknown"),
              overallScore: Number(item.totalMarkScored ?? 0),
              maxScore: 300,
              phyScore: getScore("phys"),
              chemScore: getScore("chem"),
              mathsScore: getScore("math"),
              accuracy: Number(item.accuracy ?? 0),
              avatar: item?.userId?.profilePicture ?? undefined,
              isCurrentUser: false,
            }
          })
          
          allResults.push(...mapped)
        }
      }

      let exportData = allResults
      
      if (query.trim()) {
        const searchTerm = query.trim().toLowerCase()
        exportData = exportData.filter((item) => 
          item.name.toLowerCase().includes(searchTerm)
        )
      }
      
      if (subject !== 'all') {
        exportData = exportData.filter((item) => {
          if (subject === 'phy') return item.phyScore > 0
          if (subject === 'chem') return item.chemScore > 0
          if (subject === 'maths') return item.mathsScore > 0
          return true
        })
      }
      
      exportData.sort((a, b) => {
        let aValue, bValue
        if (subject === 'phy') {
          aValue = a.phyScore
          bValue = b.phyScore
        } else if (subject === 'chem') {
          aValue = a.chemScore
          bValue = b.chemScore
        } else if (subject === 'maths') {
          aValue = a.mathsScore
          bValue = b.mathsScore
        } else if (sortBy === 'rank') {
          aValue = a.rank
          bValue = b.rank
        } else if (sortBy === 'overall') {
          aValue = a.overallScore
          bValue = b.overallScore
        } else if (sortBy === 'accuracy') {
          aValue = a.accuracy
          bValue = b.accuracy
        } else {
          aValue = a.rank
          bValue = b.rank
        }
        
        return sortDir === 'asc' ? aValue - bValue : bValue - aValue
      })

      const rows = [
        [
          "Rank",
          "Name",
          "Overall Score",
          "Max Score",
          "Physics",
          "Chemistry",
          "Maths",
          "Accuracy (%)",
        ],
        ...exportData.map((x: LeaderboardData) => [
          x.rank,
          x.name,
          x.overallScore,
          x.maxScore,
          x.phyScore,
          x.chemScore,
          x.mathsScore,
          x.accuracy.toFixed(2),
        ]),
      ]

      const csv = rows
        .map((r) => r.map((cell: any) => {
          const v = String(cell ?? '')
          if (v.includes(',') || v.includes('"') || v.includes('\n')) {
            return '"' + v.replace(/"/g, '""') + '"'
          }
          return v
        }).join(','))
        .join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const ts = new Date().toISOString().replace(/[:.]/g, '-')
      link.href = url
      link.setAttribute('download', `leaderboard-export-${ts}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export error:", err)
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }, [subject, query, sortBy, sortDir])

  const exportCsv = useCallback(() => {
    const t = toast({
      title: "Export all filtered results?",
      description: "This will export a CSV of all 10 pages with current filters and sorting applied.",
      action: (
        <ToastAction altText="Export now" onClick={() => doExport()}>
          Export
        </ToastAction>
      ),
    })
    return t
  }, [doExport])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LeaderboardHeader />
        <div className="px-4 md:px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" aria-busy>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4 animate-pulse bg-muted/30 h-40" />
            ))}
          </div>
          <div className="space-y-2" role="status" aria-live="polite">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 rounded-md bg-muted/30 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <LeaderboardHeader />
        <div className="px-4 md:px-6 py-6">
          <Alert variant="destructive" role="alert">
            <AlertTitle>Failed to load leaderboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LeaderboardHeader
        query={query}
        onQueryChange={(v) => { 
          setCurrentPage(1); 
          setQuery(v);
          if (v.trim() !== '') {
            setIsSearchMode(true);
            fetchAllData();
          } else {
            setIsSearchMode(false);
          }
        }}
        subject={subject}
        onSubjectChange={(v) => { setCurrentPage(1); setSubject(v as any) }}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortByChange={(v) => { setCurrentPage(1); setSortBy(v as any) }}
        onSortDirChange={(v) => { setCurrentPage(1); setSortDir(v) }}
        onExport={exportCsv}
      />

      <div className="pb-6">
        <div className="mb-8 hidden lg:block px-4 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {[...topPerformers, { ...currentUser, isCurrentUser: true }].map((performer) => (
              <TopPerformerCard
                key={`top-${performer.rank}-${performer.name}`}
                rank={performer.rank}
                name={performer.name}
                overallScore={performer.overallScore}
                maxScore={performer.maxScore}
                phyScore={performer.phyScore}
                chemScore={performer.chemScore}
                mathsScore={performer.mathsScore}
                accuracy={performer.accuracy}
                avatar={performer.avatar}
                isCurrentUser={performer.isCurrentUser}
              />
            ))}
          </div>
        </div>

        <div className="w-full">
          {pagedData.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No results to display.</div>
          ) : (
            <LeaderboardTable data={pagedData} currentUserRank={currentUser.rank} />
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 mb-0 text-center">
        {!isSearchMode && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        )}
        {isSearchMode && (
          <div className="py-4 text-sm text-muted-foreground">
            Showing {filteredData.length} search results
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20">
        <div
          className="mx-4 md:mx-16 mb-0 rounded-t-2xl shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--q3-base-sky) 10%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="hidden md:grid grid-cols-8 gap-4 items-center px-5 py-6">
            <div className="flex items-center"><RankBadge rank={currentUser.rank} /></div>
            <div className="col-span-2 flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-muted">
                  <Icons.User size={16} className="text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{currentUser.name}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--q3-surface-dim)] border border-[var(--q3-stroke-normal)] px-3 py-1.5 text-[13px] font-semibold text-foreground shadow-sm">
                {currentUser.overallScore}
                <span className="text-[10px] font-medium text-muted-foreground">/{currentUser.maxScore}</span>
              </span>
            </div>
            <div className="text-center font-medium">{currentUser.phyScore}</div>
            <div className="text-center font-medium">{currentUser.chemScore}</div>
            <div className="text-center font-medium">{currentUser.mathsScore}</div>
            <div className="text-center font-medium">{currentUser.accuracy.toFixed(2)}%</div>
          </div>

          <div className="md:hidden overflow-x-auto">
            <div className="min-w-[880px] grid grid-cols-8 gap-4 items-center px-4 py-4">
              <div className="flex items-center"><RankBadge rank={currentUser.rank} /></div>
              <div className="col-span-2 flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-muted">
                    <Icons.User size={16} className="text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{currentUser.name}</p>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--q3-surface-dim)] border border-[var(--q3-stroke-normal)] px-3 py-1.5 text-[13px] font-semibold text-foreground shadow-sm">
                  {currentUser.overallScore}
                  <span className="text-[10px] font-medium text-muted-foreground">/{currentUser.maxScore}</span>
                </span>
              </div>
              <div className="text-center font-medium">{currentUser.phyScore}</div>
              <div className="text-center font-medium">{currentUser.chemScore}</div>
              <div className="text-center font-medium">{currentUser.mathsScore}</div>
              <div className="text-center font-medium">{currentUser.accuracy.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
