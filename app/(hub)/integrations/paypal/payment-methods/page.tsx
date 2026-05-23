import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PayPalPaymentMethodsShell } from "@/components/integrations/settings/paypal/payment-methods/paypal-payment-methods-shell"
import { INTEGRATIONS } from "@/lib/integrations-data"

export const metadata: Metadata = {
  title: "PayPal payment methods | Payment Hub",
  description:
    "Configure which PayPal payment methods are enabled for your connected account.",
}

export default function PayPalPaymentMethodsPage() {
  const item = INTEGRATIONS.find((entry) => entry.id === "paypal")
  if (!item) notFound()
  return <PayPalPaymentMethodsShell item={item} />
}
