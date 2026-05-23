"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { IntegrationsContent } from "@/components/integrations/integrations-content"
import { OnboardingBanner } from "@/components/integrations/onboarding-banner"
import { INTEGRATIONS, resolveIntegrationStatusTab } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import { cn } from "@/lib/utils"

/**
 * Inner canvas — Figma node 2284:57152.
 * Banner, filter/search toolbar, and integration card grid / table.
 * Status tab (Connected / All) is driven by the `status` search param so
 * the Topbar sub-header tabs stay in sync with the grid. When no tab is
 * specified, Connected is the default once at least one provider is connected.
 * If zero providers are connected, we fall back to All.
 */
export function IntegrationsCanvas() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const searchParams = useSearchParams()
  const { isConnected } = useIntegrationStatus()
  const hasAnyConnected = INTEGRATIONS.some((item) => isConnected(item.id))
  const statusTab = resolveIntegrationStatusTab(
    searchParams.get("status"),
    hasAnyConnected
  )

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
      role="region"
      aria-label="Payment integrations"
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3 p-4",
          view === "grid"
            ? "overflow-y-auto overflow-x-hidden overscroll-y-contain"
            : "overflow-hidden"
        )}
      >
        <div className="shrink-0">
          <OnboardingBanner />
        </div>
        <IntegrationsContent
          view={view}
          onViewChange={setView}
          statusTab={statusTab}
        />
      </div>
    </div>
  )
}
