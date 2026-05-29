import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AuthorizeNetSettingsShell } from "@/components/integrations/settings/authorize-net/authorize-net-settings-shell"
import { MercadoPagoSettingsShell } from "@/components/integrations/settings/mercado-pago/mercado-pago-settings-shell"
import { ManualPaymentSettingsShell } from "@/components/integrations/settings/manual-payment/manual-payment-settings-shell"
import { PayPalSettingsShell } from "@/components/integrations/settings/paypal/paypal-settings-shell"
import { RazorpaySettingsShell } from "@/components/integrations/settings/razorpay/razorpay-settings-shell"
import { StripeSettingsShell } from "@/components/integrations/settings/stripe/stripe-settings-shell"
import { INTEGRATIONS } from "@/lib/integrations-data"

const SUPPORTED_SETTINGS = new Set([
  "razorpay",
  "authorize-net",
  "manual",
  "stripe",
  "paypal",
  "mercado-pago",
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

  if (providerId === "mercado-pago") {
    return <MercadoPagoSettingsShell item={item} />
  }

  if (providerId === "authorize-net") {
    return <AuthorizeNetSettingsShell item={item} />
  }

  if (providerId === "razorpay") {
    return <RazorpaySettingsShell item={item} />
  }

  notFound()
}
