"use client"

import {
  ArrowLeft,
  Trophy,
  Flask,
  Calculator,
  Target,
  User,
  CaretLeft,
  CaretRight,
  Question,
  Star,
  Medal,
  ChartBar,
  ChartLine,
  Lightning,
  Fire,
  Crown,
  Atom,
  Checks,
  MathOperations,
} from "@phosphor-icons/react"
import { Sun, Moon, Download } from "lucide-react"

export const Icons = {
  ArrowLeft,
  Trophy,
  Flask,
  Calculator,
  Target,
  User,
  ChevronLeft: CaretLeft,
  ChevronRight: CaretRight,
  Question,
  Star,
  Medal,
  ChartBar,
  ChartLine,
  Lightning,
  Fire,
  Crown,
  Atom,
  Checks,
  MathOperations,
  Sun,
  Moon,
  Download,
}

export type IconName = keyof typeof dynamicIconMap

const dynamicIconMap = {
  arrow_left: ArrowLeft,
  trophy: Trophy,
  flask: Flask,
  calculator: Calculator,
  target: Target,
  user: User,
  chevron_left: CaretLeft,
  chevron_right: CaretRight,
  question: Question,
  star: Star,
  medal: Medal,
  chart_bar: ChartBar,
  chart_line: ChartLine,
  lightning: Lightning,
  fire: Fire,
  crown: Crown,
  atom: Atom, 
  checks: Checks,
  math_operations: MathOperations,
} as const

export function getIconComponent(name?: string) {
  if (!name) return Question
  const key = name.replace(/[-\s]/g, "_").toLowerCase() as IconName
  return (dynamicIconMap as Record<string, any>)[key] ?? Question
}

export function DynamicIcon({ name, size = 20, className }: { name?: string; size?: number; className?: string }) {
  const IconComponent = getIconComponent(name)
  return <IconComponent size={size} className={className} />
}
