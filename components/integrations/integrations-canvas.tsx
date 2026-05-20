"use client"

import { useState } from "react"
import { IntegrationsContent } from "@/components/integrations/integrations-content"
import { OnboardingBanner } from "@/components/integrations/onboarding-banner"
import { cn } from "@/lib/utils"

/**
 * Inner canvas — Figma node 2284:57152.
 * Banner, filter/search toolbar, and integration card grid / table.
 */
export function IntegrationsCanvas() {
  const [view, setView] = useState<"grid" | "list">("grid")

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
        <IntegrationsContent view={view} onViewChange={setView} />
      </div>
    </div>
  )
}
