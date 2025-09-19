"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RankBadge } from "./rank-badge"
import { Icons } from "./icons"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
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

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
  currentUserRank?: number
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <div className="w-full" role="table" aria-label="Leaderboard rankings">
      <div className="mx-4 md:mx-16 rounded-xl border-2 border-[var(--q3-stroke-normal)] bg-card overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[880px]">
            <div
              className="grid grid-cols-8 gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 text-xs font-medium text-muted-foreground border-b-2 border-[var(--q3-stroke-normal)] sticky top-0 z-20 bg-[var(--q3-surface-dim)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--q3-surface-dim)]/95"
              role="rowgroup"
            >
              <div className="text-left">Rank</div>
              <div className="col-span-2">Student Name</div>
              <div className="text-center">Overall Score</div>
              <div className="text-center">Phy</div>
              <div className="text-center">Chem</div>
              <div className="text-center">Maths</div>
              <div className="text-center">Accuracy</div>
            </div>

            {/* Scrollable Table Body with Responsive Height */}
            <div 
              className="divide-y divide-[var(--q3-stroke-normal)] max-h-[380px] sm:max-h-[450px] md:max-h-[550px] lg:max-h-[650px] overflow-y-auto"
              role="rowgroup"
            >
              {data.map((entry) => (
                <div
                  key={`${entry.rank}-${entry.name}`}
                  className={cn(
                    "px-3 sm:px-5 py-3 sm:py-4 transition-colors hover:bg-muted/50",
                    entry.isCurrentUser
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : "bg-transparent",
                  )}
                  role="row"
                >
                  <div className="grid grid-cols-8 gap-2 sm:gap-4 w-full items-center">
                   
                    <div className="flex items-center"><RankBadge rank={entry.rank} /></div>

                   
                    <div className="col-span-2 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                        <AvatarFallback className="bg-muted">
                          <Icons.User size={16} className="text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{entry.name}</p>
                        {entry.isCurrentUser && <p className="text-xs text-blue-600 dark:text-blue-400">(You)</p>}
                      </div>
                    </div>

                   
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--q3-surface-dim)] border border-[var(--q3-stroke-normal)] px-3 py-1.5 text-[13px] font-semibold text-foreground shadow-sm">
                        {entry.overallScore}
                        <span className="text-[10px] font-medium text-muted-foreground">/{entry.maxScore}</span>
                      </span>
                    </div>

                    <div className="text-center font-medium text-foreground/90">{entry.phyScore}</div>
                    <div className="text-center font-medium text-foreground/90">{entry.chemScore}</div>
                    <div className="text-center font-medium text-foreground/90">{entry.mathsScore}</div>
                    <div className="text-center font-medium text-foreground/90">{entry.accuracy.toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
