import type { PmcFilterSelections } from "@/lib/stripe-payment-method-filters"
import type {
  PayPalPaymentMethodRow,
  PayPalPaymentMethodType,
} from "@/lib/paypal-payment-methods-data"
import type { PopularInRegion } from "@/lib/stripe-payment-methods-data"

const TYPE_ID_TO_ROW_TYPE: Record<string, PayPalPaymentMethodType | PayPalPaymentMethodType[]> = {
  cards: "Cards",
  wallets: "Wallets",
  "bank-redirects": ["Bank redirects", "Bank redirect"],
  "buy-now-pay-later": "Buy now, pay later",
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
  row: PayPalPaymentMethodRow,
  selectedIds: string[]
): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  return selectedIds.some((id) =>
    row.productAreas.includes(id as PayPalPaymentMethodRow["productAreas"][number])
  )
}

function matchesType(row: PayPalPaymentMethodRow, selectedIds: string[]): boolean {
  if (selectedIds.length === 0) {
    return true
  }

  return selectedIds.some((id) => {
    const mapped = TYPE_ID_TO_ROW_TYPE[id]
    if (Array.isArray(mapped)) {
      return mapped.includes(row.type)
    }
    return mapped === row.type
  })
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

export function filterPayPalPaymentMethods(
  rows: PayPalPaymentMethodRow[],
  selections: PmcFilterSelections
): PayPalPaymentMethodRow[] {
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
