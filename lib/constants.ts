export const CATEGORY_FOLDERS = {
  parents: "Parents",
  saga: "Saga",
  miyu: "Miyu",
} as const

export type Category = keyof typeof CATEGORY_FOLDERS

export const CATEGORY_METADATA: Record<
  Category,
  { label: string; icon: string }
> = {
  parents: { label: "Parents", icon: "👨‍👩‍👧‍👦" },
  saga: { label: "Saga", icon: "🚗" },
  miyu: { label: "Miyu", icon: "🏡" },
}
