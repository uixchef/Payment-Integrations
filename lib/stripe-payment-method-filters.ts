import {
  FILTER_DEFINITIONS as INTEGRATION_FILTER_DEFINITIONS,
  type FilterDefinition,
  type FilterOption,
} from "@/lib/integration-filters"

export type PmcFilterType = "product-area" | "type" | "geographic-location"

export const PMC_FILTER_TYPES: PmcFilterType[] = [
  "product-area",
  "type",
  "geographic-location",
]

const PRODUCT_AREA_OPTIONS: FilterOption[] = [
  { id: "invoices", label: "Invoices" },
  { id: "checkout", label: "Checkout" },
  { id: "payment-links", label: "Payment Links" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "terminal", label: "Terminal" },
]

const TYPE_OPTIONS: FilterOption[] = [
  { id: "cards", label: "Cards" },
  { id: "wallets", label: "Wallets" },
  { id: "bank-redirects", label: "Bank redirects" },
  { id: "buy-now-pay-later", label: "Buy now, pay later" },
  { id: "bank-debits", label: "Bank debits" },
]

export const PMC_FILTER_DEFINITIONS: Record<PmcFilterType, FilterDefinition> = {
  "product-area": {
    id: "product-area",
    tagLabel: "Product area",
    menuLabel: "Product area",
    emptyStatus: "No product areas selected yet",
    options: PRODUCT_AREA_OPTIONS,
    selectionMode: "single",
    showStatusBar: false,
    showFooter: false,
  },
  type: {
    id: "type",
    tagLabel: "Type",
    menuLabel: "Type",
    emptyStatus: "No types selected yet",
    options: TYPE_OPTIONS,
  },
  "geographic-location": {
    ...INTEGRATION_FILTER_DEFINITIONS["geographic-location"],
    id: "geographic-location",
  },
}

export const PMC_ADD_FILTER_OPTIONS = Object.values(
  PMC_FILTER_DEFINITIONS
) as Array<{ id: PmcFilterType; menuLabel: string }>

export type PmcFilterSelections = Record<PmcFilterType, string[]>

export const PMC_EMPTY_FILTER_SELECTIONS: PmcFilterSelections = {
  "product-area": [],
  type: [],
  "geographic-location": [],
}

export const PMC_DEFAULT_FILTER_SELECTIONS: PmcFilterSelections = {
  "product-area": ["invoices"],
  type: [],
  "geographic-location": [],
}
