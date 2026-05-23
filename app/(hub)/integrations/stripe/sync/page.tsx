import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { StripeSyncShell } from "@/components/integrations/settings/stripe/sync/stripe-sync-shell"
import { INTEGRATIONS } from "@/lib/integrations-data"

export const metadata: Metadata = {
  title: "Stripe sync | Payment Hub",
  description:
    "Import existing subscriptions, contacts, and saved payment references from your connected Stripe account.",
}

export default function StripeSyncPage() {
  const item = INTEGRATIONS.find((entry) => entry.id === "stripe")
  if (!item) notFound()
  return (
    <Suspense fallback={null}>
      <StripeSyncShell item={item} />
    </Suspense>
  )
}
