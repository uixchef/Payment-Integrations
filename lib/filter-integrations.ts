import type { FilterType } from "@/lib/integration-filters"
import type { IntegrationItem } from "@/lib/integrations-data"
import { getCountryLabel } from "@/lib/country-labels"

export type IntegrationFilterSelections = Record<FilterType, string[]>

export const EMPTY_FILTER_SELECTIONS: IntegrationFilterSelections = {
  "payment-methods": [],
  "geographic-location": [],
}

const FILTER_TYPES: FilterType[] = ["payment-methods", "geographic-location"]

/** Tags with applied selections, plus filters pinned while editing before Apply. */
export function getVisibleFilterTags(
  selections: IntegrationFilterSelections,
  pinnedFilterIds: FilterType[]
): FilterType[] {
  const withSelections = FILTER_TYPES.filter((id) => selections[id].length > 0)
  const tags = new Set<FilterType>([...withSelections, ...pinnedFilterIds])

  return FILTER_TYPES.filter((id) => tags.has(id))
}

const PAYMENT_METHOD_KEYWORDS: Record<string, string[]> = {
  cards: ["cards"],
  wallets: ["wallets"],
  "bank-transfer": ["bank transfer", "direct debit"],
  "buy-now-pay-later": ["buy now, pay later", "buy now pay later"],
  "cc-dc": ["cc/dc"],
  venmo: ["venmo"],
  vouchers: ["vouchers"],
  "apple-pay": ["apple pay"],
}

function matchesPaymentMethods(
  item: IntegrationItem,
  selectedIds: string[]
): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  const methods = item.methods.toLowerCase()

  return selectedIds.some((id) =>
    (PAYMENT_METHOD_KEYWORDS[id] ?? []).some((keyword) =>
      methods.includes(keyword)
    )
  )
}

function matchesGeographicLocation(
  item: IntegrationItem,
  selectedIds: string[]
): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  const { availability } = item

  if (selectedIds.includes("global") && availability.kind === "global") {
    return true
  }

  if (availability.kind === "flags") {
    return selectedIds.some((id) => availability.flags.includes(id))
  }

  return false
}

function matchesSearch(item: IntegrationItem, searchQuery: string): boolean {
  const normalized = searchQuery.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  const searchable = [
    item.name,
    item.methods,
    item.availability.kind === "global" ? item.availability.label : "",
    ...(item.availability.kind === "flags"
      ? item.availability.flags.map((code) => getCountryLabel(code))
      : []),
  ]

  return searchable.join(" ").toLowerCase().includes(normalized)
}

export function filterIntegrations(
  items: IntegrationItem[],
  selections: IntegrationFilterSelections,
  searchQuery = ""
): IntegrationItem[] {
  const paymentMethods = selections["payment-methods"]
  const geographic = selections["geographic-location"]

  const searchMatches = items.filter((item) => matchesSearch(item, searchQuery))

  if (paymentMethods.length === 0 && geographic.length === 0) {
    return searchMatches
  }

  return searchMatches.filter(
    (item) =>
      matchesPaymentMethods(item, paymentMethods) &&
      matchesGeographicLocation(item, geographic)
  )
}

export function hasActiveIntegrationFilters(
  selections: IntegrationFilterSelections,
  searchQuery: string
): boolean {
  return (
    searchQuery.trim().length > 0 ||
    selections["payment-methods"].length > 0 ||
    selections["geographic-location"].length > 0
  )
}
