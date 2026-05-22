import type { IntegrationItem } from "@/lib/integrations-data"
import { IntegrationCard } from "@/components/integrations/integration-card"

type IntegrationGridProps = {
  items: IntegrationItem[]
}

export function IntegrationGrid({ items }: IntegrationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]">
      {items.map((item) => (
        <IntegrationCard key={item.id} item={item} />
      ))}
    </div>
  )
}
