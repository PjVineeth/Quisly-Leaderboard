"use client"

import { useEffect, useMemo, useState } from "react"
import { Icons } from "./icons"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface LeaderboardHeaderProps {
  onBack?: () => void
  query?: string
  onQueryChange?: (value: string) => void
  subject?: string
  onSubjectChange?: (value: string) => void
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  onSortByChange?: (value: string) => void
  onSortDirChange?: (value: 'asc' | 'desc') => void
  onExport?: () => void
}

export function LeaderboardHeader({ onBack, query, onQueryChange, subject, onSubjectChange, sortBy, sortDir, onSortByChange, onSortDirChange, onExport }: LeaderboardHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme ?? theme) === 'dark'
  const sortLabel = useMemo(() => (sortBy === 'overall' ? 'Overall' : sortBy === 'accuracy' ? 'Accuracy' : 'Rank'), [sortBy])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-30 mb-4 mt-8">
      <div
        className={
          "mx-4 md:mx-16 rounded-2xl px-4 md:px-6 py-3 " +
          (scrolled ? "border-b border-[var(--q3-stroke-normal)]" : "border-b-0")
        }
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--q3-surface-default) 10%, transparent)"
            : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <Icons.ArrowLeft size={20} className="text-foreground" />
            </button>
            <h1 className="text-2xl font-semibold text-foreground mt-4 mb-4">Leaderboard</h1>
            <div className="ml-auto flex items-center gap-2">
              <button
                aria-label="Toggle dark mode"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-9 h-9 rounded-full border border-[var(--q3-stroke-normal)] flex items-center justify-center hover:bg-muted"
                title={isDark ? 'Switch to light' : 'Switch to dark'}
              >
                <span className="sr-only">Toggle theme</span>
                {isDark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
              </button>
            </div>
          </div>

          {!scrolled && (
            <nav className="text-sm text-muted-foreground">
              <ol className="flex items-center gap-1 flex-wrap">
                <li>JEE Main Test series</li>
                <li className="text-muted-foreground/50">/</li>
                <li>quilsy Part Test</li>
                <li className="text-muted-foreground/50">/</li>
                <li>quilsy Part Test (QPT) - 1 (Old)</li>
                <li className="text-muted-foreground/50">/</li>
                <li>Analysis</li>
                <li className="text-muted-foreground/50">/</li>
                <li className="text-foreground">Leaderboard</li>
              </ol>
            </nav>
          )}

          {/* Toolbar: single control + direction, right search */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Single control: sort or subject filter */}
              <Select
                value={(subject && subject !== 'all') ? subject : (sortBy ?? 'rank')}
                onValueChange={(v) => {
                  if (v === 'phy' || v === 'chem' || v === 'maths') {
                    onSubjectChange?.(v)
                    onSortByChange?.('rank')
                    onSortDirChange?.('desc') 
                  } else {
                    onSubjectChange?.('all') 
                    onSortByChange?.(v)
                    if (v === 'rank') {
                      onSortDirChange?.('asc')
                    } else {
                      onSortDirChange?.('desc')
                    }
                  }
                }}
              >
                <SelectTrigger className="flex-1 md:w-[160px]"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank">Rank</SelectItem>
                  <SelectItem value="overall">Overall</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="phy">Physics</SelectItem>
                  <SelectItem value="chem">Chemistry</SelectItem>
                  <SelectItem value="maths">Maths</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortDir ?? 'asc'} onValueChange={(v) => onSortDirChange?.(v as 'asc' | 'desc')}>
                <SelectTrigger className="flex-1 md:w-[120px]"><SelectValue placeholder="Direction" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by name..."
                value={query ?? ''}
                onChange={(e) => onQueryChange?.(e.target.value)}
                className="w-full md:w-64"
                aria-label="Search by name"
              />
              <Button type="button" variant="outline" size="sm" onClick={onExport} aria-label="Export CSV">
                <Icons.Download size={16} />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
