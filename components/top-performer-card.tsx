"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "./icons"
import { cn } from "@/lib/utils"

interface TopPerformerCardProps {
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

export function TopPerformerCard({
  rank,
  name,
  overallScore,
  maxScore,
  phyScore,
  chemScore,
  mathsScore,
  accuracy,
  avatar,
  isCurrentUser = false,
}: TopPerformerCardProps) {
  const getRankCardClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-card-1"
      case 2:
        return "rank-card-2"
      case 3:
        return "rank-card-3"
      default:
        return "bg-card border"
    }
  }

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[var(--rank1-rank-bg)] text-[var(--rank1-rank-color)]"
      case 2:
        return "bg-[var(--rank2-rank-bg)] text-[var(--rank2-rank-color)]"
      case 3:
        return "bg-[var(--rank3-rank-bg)] text-[var(--rank3-rank-color)]"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRankPillClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[var(--rank1-rank-bg)] text-[var(--rank1-rank-color)]"
      case 2:
        return "bg-[var(--rank2-rank-bg)] text-[var(--rank2-rank-color)]"
      case 3:
        return "bg-[var(--rank3-rank-bg)] text-[var(--rank3-rank-color)]"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRankSuffix = (rank: number) => {
    switch (rank) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const isTopThree = rank >= 1 && rank <= 3
  const cardClass = isCurrentUser ? "rank-card-4" : getRankCardClass(rank)

  return (
    <div className={cn("rounded-lg p-6 relative", cardClass)}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Badge behind avatar, centered under the circle */}
          {isTopThree ? (
            <img
              src={`/${rank}.svg`}
              alt={`Rank ${rank}`}
              width={28}
              height={28}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-0 select-none"
              draggable={false}
            />
          ) : (
            <div
              className={cn(
                "absolute -bottom-6 left-1/2 -translate-x-1/2 z-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                getRankBadgeClass(rank),
              )}
            >
              {rank}
            </div>
          )}

          <Avatar className="w-16 h-16 border-2 border-[var(--q3-stroke-normal)] relative z-10">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-muted">
              <Icons.User size={20} className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-foreground text-lg mt-4">{name}</h3>
          <div className="mt-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold shadow-sm",
                getRankPillClass(rank),
              )}
            >
              {rank}
              {getRankSuffix(rank)} Rank
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Checks size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Overall Score</span>
            </div>
            <span className="text-base font-semibold">
              {overallScore}
              <span className="text-xs text-muted-foreground">/{maxScore}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Atom size={16} className="text-emerald-600" />
              <span className="text-sm text-muted-foreground">Phy Score</span>
            </div>
            <span className="text-sm font-medium">{phyScore}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Flask size={16} className="text-[var(--q3-base-orange)]" />
              <span className="text-sm text-muted-foreground">Chem Score</span>
            </div>
            <span className="text-sm font-medium">{chemScore}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.MathOperations size={16} className="text-[var(--q3-base-blue)]" />
              <span className="text-sm text-muted-foreground">Maths Score</span>
            </div>
            <span className="text-sm font-medium">{mathsScore}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Target size={16} className="text-fuchsia-500" />
              <span className="text-sm text-muted-foreground">Accuracy</span>
            </div>
            <span className="text-sm font-medium">{accuracy.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
