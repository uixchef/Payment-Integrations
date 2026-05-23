import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { INTEGRATIONS } from "@/lib/integrations-data"

export type ProviderConfigOption = {
  id: string
  providerId: string
  label: string
  subtitle?: string
  logo: string
  disabled?: boolean
}

export type ProviderAccountOption = {
  id: string
  label: string
  connected: boolean
}

/** @deprecated Use ProviderAccountOption */
export type PayPalAccountOption = ProviderAccountOption

const DROPDOWN_PROVIDER_ORDER = [
  "stripe",
  "square",
  "nmi",
  "mercado-pago",
  "paypal",
  "gocardless",
  "razorpay",
  "authorize-net",
] as const

function getIntegrationLogo(providerId: string) {
  const item = INTEGRATIONS.find((entry) => entry.id === providerId)
  return (
    item?.logo ??
    (item?.usePlaceholder
      ? INTEGRATION_ASSETS.logos.placeholder
      : INTEGRATION_ASSETS.logos.placeholder)
  )
}

function buildProviderAccountOptions(
  providerId: "paypal" | "stripe",
  accounts: ProviderAccountOption[]
): ProviderConfigOption[] {
  const logo =
    providerId === "paypal"
      ? INTEGRATION_ASSETS.logos.paypal
      : INTEGRATION_ASSETS.logos.stripe
  const subtitle = providerId === "paypal" ? "PayPal" : "Stripe"

  return accounts.map((account) => ({
    id: `${providerId}:${account.id}`,
    providerId,
    label: account.label,
    subtitle,
    logo,
    disabled: !account.connected,
  }))
}

function buildPayPalAccountOptions(
  accounts: ProviderAccountOption[]
): ProviderConfigOption[] {
  return buildProviderAccountOptions("paypal", accounts)
}

function buildStripeAccountOptions(
  accounts: ProviderAccountOption[]
): ProviderConfigOption[] {
  return buildProviderAccountOptions("stripe", accounts)
}

export function buildProviderConfigOptions({
  isConnected,
  paypalAccounts = [],
  stripeAccounts = [],
}: {
  isConnected: (id: string) => boolean
  paypalAccounts?: ProviderAccountOption[]
  stripeAccounts?: ProviderAccountOption[]
}): ProviderConfigOption[] {
  const options: ProviderConfigOption[] = []

  for (const providerId of DROPDOWN_PROVIDER_ORDER) {
    if (!isConnected(providerId)) continue

    if (providerId === "paypal") {
      const accountOptions =
        paypalAccounts.length > 0
          ? buildPayPalAccountOptions(paypalAccounts)
          : [
              {
                id: "paypal:account-1",
                providerId: "paypal",
                label: "Account 1",
                subtitle: "PayPal",
                logo: INTEGRATION_ASSETS.logos.paypal,
              },
            ]

      options.push(...accountOptions)
      continue
    }

    if (providerId === "stripe") {
      const accountOptions =
        stripeAccounts.length > 0
          ? buildStripeAccountOptions(stripeAccounts)
          : [
              {
                id: "stripe:account-1",
                providerId: "stripe",
                label: "Account 1",
                subtitle: "Stripe",
                logo: INTEGRATION_ASSETS.logos.stripe,
              },
            ]

      options.push(...accountOptions)
      continue
    }

    const item = INTEGRATIONS.find((entry) => entry.id === providerId)
    if (!item) continue

    options.push({
      id: providerId,
      providerId,
      label: item.name,
      logo: getIntegrationLogo(providerId),
    })
  }

  return options
}

export function applyProviderOptionDisabledState(
  options: ProviderConfigOption[],
  assignedOptionIds: string[]
): ProviderConfigOption[] {
  return options.map((option) => option)
}

function getAccountBadgeFromId(accountId: string | undefined): string | undefined {
  const accountNumber = accountId?.replace("account-", "") ?? ""
  return accountNumber ? `Account ${accountNumber}` : undefined
}

export function getProviderOptionMeta(
  optionId: string,
  accountLabels?: ReadonlyMap<string, string>
): {
  label: string
  badge?: string
  logo: string
} {
  if (optionId.startsWith("paypal:")) {
    const accountId = optionId.split(":")[1]
    return {
      label: "PayPal",
      badge:
        accountLabels?.get(optionId) ?? getAccountBadgeFromId(accountId),
      logo: INTEGRATION_ASSETS.logos.paypal,
    }
  }

  if (optionId.startsWith("stripe:")) {
    const accountId = optionId.split(":")[1]
    return {
      label: "Stripe",
      badge:
        accountLabels?.get(optionId) ?? getAccountBadgeFromId(accountId),
      logo: INTEGRATION_ASSETS.logos.stripe,
    }
  }

  const item = INTEGRATIONS.find((entry) => entry.id === optionId)
  return {
    label: item?.name ?? optionId,
    logo: getIntegrationLogo(optionId),
  }
}

export function getProviderOptionLabel(optionId: string): string {
  return getProviderOptionMeta(optionId).label
}

export function getProviderRemovalDisplayName(
  optionId: string,
  accountLabels?: ReadonlyMap<string, string>
): string {
  const meta = getProviderOptionMeta(optionId, accountLabels)
  if (meta.badge) {
    return `${meta.label} ${meta.badge}`
  }
  return meta.label
}

export function getProviderOptionLogo(optionId: string): string {
  return getProviderOptionMeta(optionId).logo
}
