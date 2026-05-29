const PROVIDERS_WITH_SETTINGS = new Set([
  "razorpay",
  "authorize-net",
  "mercado-pago",
  "manual",
  "stripe",
  "paypal",
])

/** Landing-page Connect / Manage destination for a provider. */
export function getIntegrationCtaHref(
  providerId: string,
  connected: boolean
): string | null {
  if (!PROVIDERS_WITH_SETTINGS.has(providerId)) {
    return null
  }

  if (providerId === "razorpay" && !connected) {
    return "/integrations/razorpay/manage"
  }

  return `/integrations/${providerId}`
}

export function providerHasSettings(providerId: string): boolean {
  return PROVIDERS_WITH_SETTINGS.has(providerId)
}
