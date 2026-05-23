import type { PopularInRegion } from "@/lib/stripe-payment-methods-data"
import type { StripeProductArea } from "@/lib/stripe-payment-methods-data"

export type PayPalPaymentMethodType =
  | "Cards"
  | "Wallets"
  | "Bank redirects"
  | "Buy now, pay later"
  | "Bank redirect"

export type PayPalPaymentMethodRow = {
  id: string
  name: string
  icon: string
  type: PayPalPaymentMethodType
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

const ICON_BASE = "/integrations/paypal/payment-methods"

export const PAYPAL_PAYMENT_METHODS: PayPalPaymentMethodRow[] = [
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
    id: "paypal-wallet",
    name: "PayPal wallet",
    icon: "/integrations/no-providers-connected/paypal.svg",
    type: "Wallets",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: false,
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: "/integrations/stripe/payment-methods/apple-pay.svg",
    type: "Wallets",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
  },
  {
    id: "google-pay",
    name: "Google Pay",
    icon: "/integrations/banner/gpay.png",
    type: "Wallets",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
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
    id: "paypal-checkout",
    name: "PayPal checkout",
    icon: "/integrations/no-providers-connected/paypal.svg",
    type: "Buy now, pay later",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
  },
  {
    id: "pay-later",
    name: "Pay later",
    icon: "/integrations/no-providers-connected/paypal.svg",
    type: "Buy now, pay later",
    popularIn: { kind: "all-regions" },
    productAreas: ALL_AREAS,
    enabled: true,
  },
  {
    id: "trustly",
    name: "Trustly",
    icon: `${ICON_BASE}/trustly.png`,
    type: "Bank redirect",
    popularIn: { kind: "region", label: "Europe" },
    productAreas: ["invoices", "checkout"],
    enabled: false,
  },
]

export function countEnabledPayPalPaymentMethods(
  enabledById: Record<string, boolean>
): number {
  return PAYPAL_PAYMENT_METHODS.filter((row) => enabledById[row.id]).length
}

export function initialPayPalPaymentMethodEnabledState(): Record<string, boolean> {
  return Object.fromEntries(
    PAYPAL_PAYMENT_METHODS.map((row) => [row.id, row.enabled])
  )
}
