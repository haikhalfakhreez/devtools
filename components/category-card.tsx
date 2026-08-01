import Link from "next/link"

interface CategoryCardProps {
  label: string
  icon: string
  slug: string
}

export function CategoryCard({ label, icon, slug }: CategoryCardProps) {
  return (
    <Link
      href={`/upload/${slug}`}
      className="flex w-full max-w-sm items-center gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors hover:bg-muted"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-lg font-medium">{label}</span>
    </Link>
  )
}
