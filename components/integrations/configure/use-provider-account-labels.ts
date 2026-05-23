"use client"

import { useMemo } from "react"
import { usePayPalAccounts } from "@/components/integrations/settings/paypal/paypal-accounts-context"
import { useStripeAccounts } from "@/components/integrations/settings/stripe/stripe-accounts-context"

export function useProviderAccountLabelMap(): ReadonlyMap<string, string> {
  const { accounts: paypalAccounts } = usePayPalAccounts()
  const { accounts: stripeAccounts } = useStripeAccounts()

  return useMemo(() => {
    const labels = new Map<string, string>()

    for (const account of paypalAccounts) {
      labels.set(`paypal:${account.id}`, account.label)
    }

    for (const account of stripeAccounts) {
      labels.set(`stripe:${account.id}`, account.label)
    }

    return labels
  }, [paypalAccounts, stripeAccounts])
}
