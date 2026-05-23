import type { PmcFilterSelections } from "@/lib/stripe-payment-method-filters"
import type {
  PopularInRegion,
  StripePaymentMethodRow,
  StripePaymentMethodType,
} from "@/lib/stripe-payment-methods-data"

const TYPE_ID_TO_ROW_TYPE: Record<string, StripePaymentMethodType> = {
  cards: "Cards",
  wallets: "Wallet",
  "bank-redirects": "Bank redirects",
  "buy-now-pay-later": "Buy now, pay later",
  "bank-debits": "Bank debits",
}

const EUROPE_COUNTRY_CODES = new Set([
  "AT",
  "BE",
  "CH",
  "CZ",
  "DE",
  "DK",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "IE",
  "IT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
])

function matchesProductArea(
  row: StripePaymentMethodRow,
  selectedIds: string[]
): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  return selectedIds.some((id) =>
    row.productAreas.includes(id as StripePaymentMethodRow["productAreas"][number])
  )
}

function matchesType(row: StripePaymentMethodRow, selectedIds: string[]): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  return selectedIds.some((id) => TYPE_ID_TO_ROW_TYPE[id] === row.type)
}

function getCountryCodes(popularIn: PopularInRegion): string[] {
  if (popularIn.kind === "countries") {
    return [
      ...popularIn.countries
        .map((country) => country.flagCode)
        .filter((code): code is string => Boolean(code)),
      ...(popularIn.tooltipFlags ?? []),
    ]
  }

  return []
}

function matchesGeographicLocation(
  popularIn: PopularInRegion,
  selectedIds: string[]
): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  if (popularIn.kind === "all-regions") {
    return selectedIds.includes("global")
  }

  if (popularIn.kind === "region") {
    if (popularIn.label === "Europe") {
      return selectedIds.some((id) => EUROPE_COUNTRY_CODES.has(id))
    }

    return false
  }

  const countryCodes = getCountryCodes(popularIn)
  return selectedIds.some((id) => countryCodes.includes(id))
}

export function filterStripePaymentMethods(
  rows: StripePaymentMethodRow[],
  selections: PmcFilterSelections
): StripePaymentMethodRow[] {
  const productArea = selections["product-area"]
  const type = selections.type
  const geographic = selections["geographic-location"]

  if (
    productArea.length === 0 &&
    type.length === 0 &&
    geographic.length === 0
  ) {
    return rows
  }

  return rows.filter(
    (row) =>
      matchesProductArea(row, productArea) &&
      matchesType(row, type) &&
      matchesGeographicLocation(row.popularIn, geographic)
  )
}
