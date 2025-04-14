import { EpochConverter } from '@/components/epoch-converter'
import { UrlTool } from '@/components/url-tool'
import { PaceConverter } from '@/components/pace-converter'
import { CurrencyConverter } from '@/components/currency-converter'
import { ShoeSizeConverter } from '@/components/shoe-size-converter'

export default function DevDashboard() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="flex justify-center py-1">
        <h1 className="text-base font-mono">devtools</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 pb-4">
        <EpochConverter />
        <UrlTool />
        <PaceConverter />
        {/* <CurrencyConverter />
        <ShoeSizeConverter /> */}
      </div>
    </div>
  )
}
