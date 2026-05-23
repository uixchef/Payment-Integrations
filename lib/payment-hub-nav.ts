export const PAYMENTS_HUB_DEFAULTS = {
  overview:
    process.env.NEXT_PUBLIC_OVERVIEW_APP_URL ??
    "https://payment-dashboard-9byi.vercel.app/payment-hub",
  subscriptions:
    process.env.NEXT_PUBLIC_SUBSCRIPTIONS_APP_URL ??
    "https://subscription-pi-nine.vercel.app/subscriptions",
  integrations:
    process.env.NEXT_PUBLIC_INTEGRATIONS_APP_URL ?? "",
} as const

const NAV_CONTEXT_KEY = "payments-hub-nav-context"

/** @deprecated Use NAV_CONTEXT_KEY via syncPaymentsHubNav */
export const INTEGRATIONS_RETURN_STORAGE_KEY = "payments-hub-integrations-return-url"

export type PaymentsHubNavContext = {
  overview?: string
  subscriptions?: string
  integrations?: string
}

export type PaymentsHubNavUrls = {
  overview: string
  subscriptions: string
  integrations: string
}

function readNavContext(): PaymentsHubNavContext {
  if (typeof window === "undefined") return {}

  try {
    const raw = window.sessionStorage.getItem(NAV_CONTEXT_KEY)
    if (!raw) return {}

    return JSON.parse(raw) as PaymentsHubNavContext
  } catch {
    return {}
  }
}

function writeNavContext(context: PaymentsHubNavContext) {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(NAV_CONTEXT_KEY, JSON.stringify(context))
  } catch {
    // Ignore storage failures in the prototype.
  }
}

function inferNavTargetFromUrl(url: string): Partial<PaymentsHubNavContext> {
  if (url.includes("/integrations")) {
    return { integrations: url }
  }

  if (url.includes("/subscriptions")) {
    return { subscriptions: url }
  }

  if (url.includes("/payment-hub")) {
    return { overview: url }
  }

  return {}
}

export function syncPaymentsHubNav(patch: Partial<PaymentsHubNavContext>) {
  if (typeof window === "undefined") return

  const next = { ...readNavContext(), ...patch }

  try {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo")
    if (returnTo) {
      Object.assign(next, inferNavTargetFromUrl(returnTo))

      // Backwards compatibility with the earlier integrations-only storage key.
      if (returnTo.includes("/integrations")) {
        window.sessionStorage.setItem(INTEGRATIONS_RETURN_STORAGE_KEY, returnTo)
      }
    }
  } catch {
    // Ignore malformed URLs in the prototype.
  }

  writeNavContext(next)
}

export function getPaymentsHubNav(): PaymentsHubNavUrls {
  const context = readNavContext()

  let integrations =
    context.integrations || PAYMENTS_HUB_DEFAULTS.integrations

  if (!integrations && typeof window !== "undefined") {
    integrations = `${window.location.origin}/integrations`
  }

  if (!integrations) {
    integrations = "/integrations"
  }

  return {
    overview: context.overview || PAYMENTS_HUB_DEFAULTS.overview,
    subscriptions: context.subscriptions || PAYMENTS_HUB_DEFAULTS.subscriptions,
    integrations,
  }
}

export function getIntegrationsHubPath() {
  return "/integrations"
}

export function getIntegrationsHubUrl() {
  if (typeof window === "undefined") {
    return getIntegrationsHubPath()
  }

  return `${window.location.origin}${getIntegrationsHubPath()}`
}

/** @deprecated Use getPaymentsHubNav().integrations */
export function readIntegrationsReturnUrl(fallback?: string) {
  return getPaymentsHubNav().integrations || fallback || getIntegrationsHubUrl()
}

/** @deprecated Use syncPaymentsHubNav */
export function rememberIntegrationsReturnUrl(returnTo: string) {
  syncPaymentsHubNav(inferNavTargetFromUrl(returnTo))
}

/** @deprecated Use getPaymentsHubNav().subscriptions */
export const SUBSCRIPTIONS_APP_URL = PAYMENTS_HUB_DEFAULTS.subscriptions

/** @deprecated Use syncPaymentsHubNav + getPaymentsHubNav */
export function getSubscriptionsAppUrl(integrationsReturnUrl?: string) {
  const nav = getPaymentsHubNav()
  const returnTo = integrationsReturnUrl ?? getIntegrationsHubUrl()

  try {
    const url = new URL(nav.subscriptions)
    url.searchParams.set("returnTo", returnTo)
    return url.toString()
  } catch {
    return nav.subscriptions
  }
}

export function resolvePaymentsHubNavUrls(
  app: "overview" | "subscriptions" | "integrations"
): PaymentsHubNavUrls {
  if (typeof window === "undefined") {
    return {
      overview: PAYMENTS_HUB_DEFAULTS.overview,
      subscriptions: PAYMENTS_HUB_DEFAULTS.subscriptions,
      integrations: PAYMENTS_HUB_DEFAULTS.integrations || "/integrations",
    }
  }

  const patch: Partial<PaymentsHubNavContext> = {}

  if (app === "integrations") {
    patch.integrations = getIntegrationsHubUrl()
  } else if (app === "overview") {
    patch.overview = `${window.location.origin}/payment-hub`
  } else {
    patch.subscriptions = `${window.location.origin}/subscriptions`
  }

  syncPaymentsHubNav(patch)
  return getPaymentsHubNav()
}
