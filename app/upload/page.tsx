import { CategoryCard } from "@/components/category-card"
import { CATEGORY_METADATA } from "@/lib/constants"

export default function UploadHubPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="mb-4 text-2xl font-medium">Upload Receipts</h1>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {Object.entries(CATEGORY_METADATA).map(([slug, meta]) => (
          <CategoryCard key={slug} label={meta.label} icon={meta.icon} slug={slug} />
        ))}
      </div>
    </div>
  )
}
