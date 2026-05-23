import type { PopularInRegion } from "@/lib/stripe-payment-methods-data"

export function getPopularInCountryCodes(popularIn: PopularInRegion): string[] {
  if (popularIn.kind !== "countries") {
    return []
  }

  const visible = popularIn.countries
    .map((country) => country.flagCode)
    .filter((code): code is string => Boolean(code))

  return [...visible, ...(popularIn.tooltipFlags ?? [])]
}
