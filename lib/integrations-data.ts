import { INTEGRATION_ASSETS } from "@/lib/integration-assets"

export type IntegrationStatusTab = "connected" | "all"

export type IntegrationAvailability =
  | { kind: "global"; label: string }
  | { kind: "region"; label: string }
  | { kind: "flags"; flags: string[]; extraCount?: number; tooltipFlags?: string[]; regionLabel?: string }
  | { kind: "location"; label: string }

export type IntegrationItem = {
  id: string
  name: string
  methods: string
  availability: IntegrationAvailability
  verified?: boolean
  logo?: string
  usePlaceholder?: boolean
  connected?: boolean
}

export const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "stripe",
    name: "Stripe",
    methods: "Cards · Wallets · Bank transfers · Buy now, pay later",
    availability: { kind: "global", label: "Available globally" },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.stripe,
  },
  {
    id: "paypal",
    name: "PayPal",
    methods: "Cards · Wallets · Bank transfers · Buy now, pay later",
    availability: { kind: "global", label: "Available globally" },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.paypal,
  },
  {
    id: "nmi",
    name: "NMI",
    methods: "Cards · Bank transfers",
    availability: {
      kind: "flags",
      flags: ["US", "GB", "CA", "AU", "DE", "FR"],
      extraCount: 44,
    },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.nmi,
  },
  {
    id: "mercado-pago",
    name: "Mercado Pago",
    methods: "Cards · Wallets · Bank transfers",
    availability: {
      kind: "flags",
      flags: ["MX", "BR", "AR", "CL", "CO", "UY"],
      extraCount: 2,
      regionLabel: "Latin America",
      tooltipFlags: ["MX", "BR", "AR", "CL", "CO", "UY", "PE", "US"],
    },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.mercadoPago,
  },
  {
    id: "gocardless",
    name: "GoCardless",
    methods: "Bank transfers (direct debit)",
    availability: {
      kind: "flags",
      flags: ["GB", "FR", "ES", "IT", "NL", "DE"],
      extraCount: 24,
      regionLabel: "Europe",
    },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.gocardless,
  },
  {
    id: "square",
    name: "Square",
    methods: "Cards · Wallets",
    availability: {
      kind: "flags",
      flags: ["US", "CA", "GB", "AU", "JP", "FR"],
      extraCount: 2,
    },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.square,
  },
  {
    id: "authorize-net",
    name: "Authorize.net",
    methods: "Cards · Bank transfers",
    availability: {
      kind: "flags",
      flags: ["US", "CA", "AU"],
    },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.authorizeNet,
  },
  {
    id: "manual",
    name: "Manual payment methods",
    methods: "Manual / offline payments",
    availability: {
      kind: "location",
      label: "Availability depends on business location.",
    },
    verified: true,
    logo: INTEGRATION_ASSETS.logos.manual,
  },
  {
    id: "razorpay",
    name: "Razorpay",
    methods: "Cards · Wallets · Bank transfers · Buy now, pay later",
    availability: { kind: "flags", flags: ["IN"] },
    logo: INTEGRATION_ASSETS.logos.razorpay,
  },
  {
    id: "easy-pay-direct",
    name: "Easy Pay Direct",
    methods: "Cards · Bank transfers",
    availability: {
      kind: "location",
      label: "Availability depends on business location.",
    },
    logo: INTEGRATION_ASSETS.logos.easyPayDirect,
  },
  {
    id: "deposyt",
    name: "Deposyt (sub-accounts)",
    methods: "Cards · Wallets · Bank transfers",
    availability: {
      kind: "location",
      label: "Availability depends on business location.",
    },
    logo: INTEGRATION_ASSETS.logos.deposyt,
  },
  {
    id: "madison",
    name: "Madison payment specialists",
    methods: "Cards · Bank transfers",
    availability: {
      kind: "location",
      label: "Availability depends on business location.",
    },
    logo: INTEGRATION_ASSETS.logos.madison,
  },
  {
    id: "paymob",
    name: "PayMob الشرق الأوسط",
    methods: "Cards · Wallets · Bank transfers",
    availability: { kind: "region", label: "Middle East and North Africa" },
    logo: INTEGRATION_ASSETS.logos.paymob,
  },
  {
    id: "paytabs",
    name: "PayTabs global & الشرق الأوسط",
    methods: "Cards · Wallets · Bank transfers",
    availability: { kind: "region", label: "Middle East and North Africa" },
    logo: INTEGRATION_ASSETS.logos.paytabs,
  },
  {
    id: "eway",
    name: "Eway",
    methods: "Cards · Wallets",
    availability: { kind: "flags", flags: ["US", "AU"] },
    logo: INTEGRATION_ASSETS.logos.eway,
  },
  {
    id: "payplus",
    name: "PayPlus payment",
    methods: "Cards · Wallets · Bank transfers",
    availability: {
      kind: "location",
      label: "Availability depends on business location.",
    },
    logo: INTEGRATION_ASSETS.logos.payplus,
  },
  {
    id: "noomerik",
    name: "Noomerik (sub-account)",
    methods: "Cards · Wallets · Bank transfers",
    availability: {
      kind: "location",
      label: "Availability depends on business location.",
    },
    logo: INTEGRATION_ASSETS.logos.noomerik,
  },
  {
    id: "gocardless-workflows",
    name: "GoCardless for workflows",
    methods: "Bank transfers (direct debit)",
    availability: { kind: "region", label: "Europe" },
    logo: INTEGRATION_ASSETS.logos.gocardless,
  },
  {
    id: "clover",
    name: "Clover private integration",
    methods: "Cards · Wallets",
    availability: {
      kind: "flags",
      flags: ["US", "GB", "CA", "AU", "DE", "NL"],
      extraCount: 7,
    },
    logo: INTEGRATION_ASSETS.logos.clover,
  },
]

export function getConnectedCount(items: IntegrationItem[]): number {
  return items.filter((item) => item.connected).length
}

export function filterByStatusTab(
  items: IntegrationItem[],
  tab: IntegrationStatusTab
): IntegrationItem[] {
  if (tab === "connected") {
    return items.filter((item) => item.connected)
  }
  return items
}

export function parseStatusTab(
  value: string | null | undefined
): IntegrationStatusTab {
  return value === "connected" ? "connected" : "all"
}

/** Resolves the active status tab from URL params and connection state. */
export function resolveIntegrationStatusTab(
  statusParam: string | null | undefined,
  hasAnyConnected: boolean
): IntegrationStatusTab {
  if (statusParam === "all") return "all"
  if (statusParam === "connected") {
    return hasAnyConnected ? "connected" : "all"
  }
  return hasAnyConnected ? "connected" : "all"
}
