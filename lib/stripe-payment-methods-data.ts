/**
 * Stripe payment method rows for PMC UI.
 * "Popular in" reflects Stripe-documented customer locations per method
 * (https://docs.stripe.com/payments/payment-methods/payment-method-support).
 */

export type StripePaymentMethodType =
  | "Cards"
  | "Wallet"
  | "Bank redirects"
  | "Buy now, pay later"
  | "Bank debits"

export type PopularInRegion =
  | { kind: "all-regions" }
  | { kind: "region"; label: string }
  | {
      kind: "countries"
      countries: Array<{ flagCode?: string; label: string }>
      extraCount?: number
      tooltipFlags?: string[]
    }

export type StripeProductArea =
  | "invoices"
  | "checkout"
  | "payment-links"
  | "subscriptions"
  | "terminal"

export type StripePaymentMethodRow = {
  id: string
  name: string
  icon: string
  type: StripePaymentMethodType
  popularIn: PopularInRegion
  productAreas: StripeProductArea[]
  enabled: boolean
}

const ALL_AREAS: StripeProductArea[] = [
  "invoices",
  "checkout",
  "payment-links",
  "subscriptions",
  "terminal",
]

const ICON_BASE = "/integrations/stripe/payment-methods"

export const STRIPE_PAYMENT_METHODS: StripePaymentMethodRow[] = [
  {
    id: "cards",
    name: "Cards",
    icon: "/integrations/table/credit-card.svg",
    type: "Cards",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
  },
  {
    id: "amazon-pay",
    name: "Amazon Pay",
    icon: `${ICON_BASE}/amazon-pay.svg`,
    type: "Wallet",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: false,
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: `${ICON_BASE}/apple-pay.svg`,
    type: "Wallet",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
  },
  {
    id: "cash-app-pay",
    name: "Cash App Pay",
    icon: `${ICON_BASE}/cash-app-pay.png`,
    type: "Wallet",
    popularIn: {
      kind: "countries",
      countries: [{ flagCode: "US", label: "United States of America" }],
    },
    productAreas: ["invoices", "checkout", "payment-links"],
    enabled: true,
  },
  {
    id: "google-pay",
    name: "Google Pay",
    icon: "/integrations/banner/gpay.png",
    type: "Wallet",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
  },
  {
    id: "link",
    name: "Link",
    icon: `${ICON_BASE}/link.png`,
    type: "Wallet",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: false,
  },
  {
    id: "bancontact",
    name: "Bancontact",
    icon: `${ICON_BASE}/bancontact.png`,
    type: "Bank redirects",
    popularIn: {
      kind: "countries",
      countries: [{ flagCode: "BE", label: "Belgium" }],
    },
    productAreas: ["invoices", "checkout"],
    enabled: false,
  },
  {
    id: "ideal",
    name: "iDeal",
    icon: `${ICON_BASE}/ideal.png`,
    type: "Bank redirects",
    popularIn: {
      kind: "countries",
      countries: [{ flagCode: "NL", label: "Netherlands" }],
    },
    productAreas: ["invoices", "checkout"],
    enabled: false,
  },
  {
    id: "affirm",
    name: "Affirm",
    icon: `${ICON_BASE}/affirm.png`,
    type: "Buy now, pay later",
    popularIn: {
      kind: "countries",
      countries: [
        { flagCode: "US", label: "United States of America" },
        { flagCode: "CA", label: "Canada" },
      ],
    },
    productAreas: ["invoices", "checkout", "payment-links"],
    enabled: true,
  },
  {
    id: "afterpay",
    name: "Afterpay / Clearpay",
    icon: `${ICON_BASE}/afterpay.png`,
    type: "Buy now, pay later",
    popularIn: {
      kind: "countries",
      countries: [
        { flagCode: "US", label: "United States of America" },
        { flagCode: "GB", label: "United Kingdom" },
        { flagCode: "AU", label: "Australia" },
      ],
      extraCount: 2,
      tooltipFlags: ["CA", "NZ"],
    },
    productAreas: ["invoices", "checkout", "payment-links"],
    enabled: true,
  },
  {
    id: "klarna",
    name: "Klarna",
    icon: `${ICON_BASE}/klarna.png`,
    type: "Buy now, pay later",
    popularIn: {
      kind: "countries",
      countries: [
        { flagCode: "US", label: "United States of America" },
        { flagCode: "GB", label: "United Kingdom" },
        { flagCode: "DE", label: "Germany" },
      ],
      extraCount: 20,
      tooltipFlags: [
        "AU",
        "AT",
        "BE",
        "CA",
        "CH",
        "CZ",
        "DK",
        "ES",
        "FI",
        "FR",
        "GR",
        "IE",
        "IT",
        "NL",
        "NO",
        "NZ",
        "PL",
        "PT",
        "RO",
        "SE",
      ],
    },
    productAreas: ["invoices", "checkout", "payment-links"],
    enabled: false,
  },
  {
    id: "zip",
    name: "Zip",
    icon: `${ICON_BASE}/zip.png`,
    type: "Buy now, pay later",
    popularIn: {
      kind: "countries",
      countries: [
        { flagCode: "AU", label: "Australia" },
        { flagCode: "US", label: "United States of America" },
      ],
    },
    productAreas: ["invoices", "checkout"],
    enabled: false,
  },
  {
    id: "sepa",
    name: "SEPA direct debit",
    icon: `${ICON_BASE}/sepa.png`,
    type: "Bank debits",
    popularIn: { kind: "region", label: "Europe" },
    productAreas: ["invoices", "subscriptions"],
    enabled: false,
  },
  {
    id: "ach",
    name: "ACH debit",
    icon: `${ICON_BASE}/ach.png`,
    type: "Bank debits",
    popularIn: {
      kind: "countries",
      countries: [{ flagCode: "US", label: "United States of America" }],
    },
    productAreas: ["invoices", "subscriptions"],
    enabled: false,
  },
  {
    id: "bacs",
    name: "BACS direct debit",
    icon: `${ICON_BASE}/bacs.png`,
    type: "Bank debits",
    popularIn: {
      kind: "countries",
      countries: [{ flagCode: "GB", label: "United Kingdom" }],
    },
    productAreas: ["invoices", "subscriptions"],
    enabled: false,
  },
]

export function countEnabledPaymentMethods(
  enabledById: Record<string, boolean>
): number {
  return STRIPE_PAYMENT_METHODS.filter((row) => enabledById[row.id]).length
}

export function initialPaymentMethodEnabledState(): Record<string, boolean> {
  return Object.fromEntries(
    STRIPE_PAYMENT_METHODS.map((row) => [row.id, row.enabled])
  )
}
