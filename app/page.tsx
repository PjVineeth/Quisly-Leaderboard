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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState<'phy' | 'chem' | 'maths' | 'all'>("all")
  const [sortBy, setSortBy] = useState<'rank' | 'overall' | 'accuracy'>("rank")
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc")

  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log("Fetching leaderboard data from API...")
        const res = await fetch("https://api.quizrr.in/api/hiring/leaderboard?page=1&limit=100", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })
        
        console.log("Response status:", res.status)
        
        if (!res.ok) {
          const errorText = await res.text()
          console.error("API Error Response:", errorText)
          throw new Error(`Request failed: ${res.status} - ${errorText}`)
        }
        
        const json = await res.json()
        console.log("API Response received, processing data...")
        
        const list: any[] = (json?.data?.results ?? []) as any[]
        console.log("Leaderboard list length:", list.length)
        
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
        
        console.log("Successfully loaded", mapped.length, "leaderboard entries")
        setLeaderboardData(mapped)
      } catch (err: any) {
        console.error("Fetch error:", err)
        setError(`API Error: ${err?.message ?? "Failed to load data"}. Using mock data for demonstration.`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Track desktop breakpoint (lg: 1024px)
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

  // Consolidated sorting logic
  const getSortValue = useCallback((x: LeaderboardData) => {
    if (subject === 'phy') return x.phyScore
    if (subject === 'chem') return x.chemScore
    if (subject === 'maths') return x.mathsScore
    if (sortBy === 'rank') return x.rank
    if (sortBy === 'overall') return x.overallScore
    if (sortBy === 'accuracy') return x.accuracy
    return x.rank
  }, [subject, sortBy])

  // Search and filter data
  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase()
    let filtered = leaderboardData
    
    if (q) {
      filtered = filtered.filter((x) => x.name.toLowerCase().includes(q))
    }
    
    return filtered
  }, [leaderboardData, query])

  // Sort data
  const sortedData = useMemo(() => {
    const arr = [...filteredData]
    arr.sort((a, b) => {
      const va = getSortValue(a)
      const vb = getSortValue(b)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return arr
  }, [filteredData, getSortValue, sortDir])

  
  const topPerformers = useMemo(() => sortedData.slice(0, 3), [sortedData])
  

  const tableData = useMemo(() => 
    isDesktop ? sortedData.slice(3) : sortedData, 
    [sortedData, isDesktop]
  )

  const totalPages = Math.max(1, Math.ceil((tableData.length || 0) / itemsPerPage))
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return tableData.slice(start, end)
  }, [tableData, currentPage])

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

  const doExport = useCallback(() => {
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
      ...sortedData.map((x) => [
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
      .map((r) => r.map((cell) => {
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
  }, [sortedData])

  const exportCsv = useCallback(() => {
    const t = toast({
      title: "Export filtered results?",
      description: "This will export a CSV of the current filter and sorting.",
      action: (
        <ToastAction altText="Export now" onClick={doExport}>
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
          {/* Loading skeleton rows without outer card/title */}
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
        onQueryChange={(v) => { setCurrentPage(1); setQuery(v) }}
        subject={subject}
        onSubjectChange={(v) => { setCurrentPage(1); setSubject(v as any) }}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortByChange={(v) => { setCurrentPage(1); setSortBy(v as any) }}
        onSortDirChange={(v) => { setCurrentPage(1); setSortDir(v) }}
        onExport={exportCsv}
      />

      <div className="px-4 md:px-16 pb-6">
        {/* Users (top cards) - large screens only */}
        <div className="mb-8 hidden lg:block">
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

        {/* Table */}
        <div className="p-0">
          {pagedData.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No results to display.</div>
          ) : (
            <LeaderboardTable data={pagedData} currentUserRank={currentUser.rank} />
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 mb-0 text-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
