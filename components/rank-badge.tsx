"use client"

import { cn } from "@/lib/utils"

interface RankBadgeProps {
  rank: number
  className?: string
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  const isTopThree = rank >= 1 && rank <= 3

  if (isTopThree) {
    return (
      <img
        src={`/${rank}.svg`}
        alt={`Rank ${rank}`}
        width={24}
        height={24}
        className={cn("block select-none", className)}
        draggable={false}
      />
    )
  }

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[var(--rank1-rank-bg)] text-[var(--rank1-rank-color)] border-[var(--rank1-rank-color)]/20"
      case 2:
        return "bg-[var(--rank2-rank-bg)] text-[var(--rank2-rank-color)] border-[var(--rank2-rank-color)]/20"
      case 3:
        return "bg-[var(--rank3-rank-bg)] text-[var(--rank3-rank-color)] border-[var(--rank3-rank-color)]/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium",
        getRankStyles(rank),
        className,
      )}
    >
      {rank}
    </div>
  )
}
