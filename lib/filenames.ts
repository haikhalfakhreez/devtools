import type { Category } from "./constants"

export const RECOMMENDED_TITLES: Record<Category, string[]> = {
  parents: ["Baba", "Ibu"],
  miyu: ["Rent", "TNB", "Water"],
  saga: ["Saga"],
}

export function buildRecommendedFilename(title: string, ext: string, date = new Date()): string {
  const monthNumber = date.getMonth() + 1
  const monthAbbrev = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()
  return `${monthNumber}. ${title} - ${monthAbbrev} ${year}.${ext}`
}
