import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StripePaymentMethodsShell } from "@/components/integrations/settings/stripe/payment-methods/stripe-payment-methods-shell"
import { INTEGRATIONS } from "@/lib/integrations-data"

export const metadata: Metadata = {
  title: "Stripe payment methods | Payment Hub",
  description:
    "Configure which Stripe payment methods are enabled for your connected account.",
}

export default function StripePaymentMethodsPage() {
  const item = INTEGRATIONS.find((entry) => entry.id === "stripe")
  if (!item) notFound()
  return <StripePaymentMethodsShell item={item} />
}
