import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { IntegrationSettingsShell } from "@/components/integrations/settings/integration-settings-shell"
import { ManualPaymentSettingsShell } from "@/components/integrations/settings/manual-payment/manual-payment-settings-shell"
import { PayPalSettingsShell } from "@/components/integrations/settings/paypal/paypal-settings-shell"
import { StripeSettingsShell } from "@/components/integrations/settings/stripe/stripe-settings-shell"
import { INTEGRATIONS } from "@/lib/integrations-data"

const SUPPORTED_SETTINGS = new Set([
  "razorpay",
  "authorize-net",
  "mercado-pago",
  "manual",
  "stripe",
  "paypal",
])

type Params = Promise<{ providerId: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { providerId } = await params
  const item = INTEGRATIONS.find((entry) => entry.id === providerId)

  if (!item) {
    return { title: "Integration | Payment Hub" }
  }

  return {
    title:
      providerId === "manual"
        ? "Manual payment method settings | Payment Hub"
        : `${item.name} settings | Payment Hub`,
    description:
      providerId === "manual"
        ? "Configure cash on delivery and custom manual payment methods"
        : `Configure ${item.name} integration credentials`,
  }
}

export default async function IntegrationSettingsPage({
  params,
}: {
  params: Params
}) {
  const { providerId } = await params
  const item = INTEGRATIONS.find((entry) => entry.id === providerId)

  if (!item || !SUPPORTED_SETTINGS.has(providerId)) {
    notFound()
  }

  if (providerId === "manual") {
    return <ManualPaymentSettingsShell />
  }

  if (providerId === "stripe") {
    return <StripeSettingsShell item={item} />
  }

  if (providerId === "paypal") {
    return <PayPalSettingsShell item={item} />
  }

  return <IntegrationSettingsShell item={item} />
}
