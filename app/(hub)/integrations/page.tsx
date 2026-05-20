import type { Metadata } from "next"
import { IntegrationsCanvas } from "@/components/integrations/integrations-canvas"

export const metadata: Metadata = {
  title: "Integrations | Payment Hub",
  description: "Connect payment providers and third-party apps",
}

/**
 * Hub main column — Integrations canvas (Figma 2284:57152).
 * Shell chrome from `app/(hub)/layout.tsx` → PaymentHubShell.
 */
export default function IntegrationsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
      <IntegrationsCanvas />
    </div>
  )
}
