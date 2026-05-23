import { getCountryLabel } from "@/lib/country-labels"

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America"

export type IntegrationCountry = {
  continent: Continent
  code: string
}

/**
 * NMI merchant countries (50 total).
 * Source: HighLevel NMI country list — major acquiring regions across six continents.
 */
const NMI_COUNTRIES: IntegrationCountry[] = [
  { continent: "Africa", code: "EG" },
  { continent: "Africa", code: "ZA" },
  { continent: "Africa", code: "MA" },
  { continent: "Africa", code: "NG" },
  { continent: "Africa", code: "KE" },
  { continent: "Asia", code: "AE" },
  { continent: "Asia", code: "HK" },
  { continent: "Asia", code: "ID" },
  { continent: "Asia", code: "IL" },
  { continent: "Asia", code: "IN" },
  { continent: "Asia", code: "JP" },
  { continent: "Asia", code: "KR" },
  { continent: "Asia", code: "MY" },
  { continent: "Asia", code: "PH" },
  { continent: "Asia", code: "SA" },
  { continent: "Asia", code: "SG" },
  { continent: "Asia", code: "TH" },
  { continent: "Asia", code: "VN" },
  { continent: "Europe", code: "AT" },
  { continent: "Europe", code: "BE" },
  { continent: "Europe", code: "CH" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "DK" },
  { continent: "Europe", code: "ES" },
  { continent: "Europe", code: "FI" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "IT" },
  { continent: "Europe", code: "NL" },
  { continent: "Europe", code: "NO" },
  { continent: "Europe", code: "PL" },
  { continent: "Europe", code: "PT" },
  { continent: "Europe", code: "SE" },
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "North America", code: "MX" },
  { continent: "North America", code: "CR" },
  { continent: "North America", code: "DO" },
  { continent: "North America", code: "GT" },
  { continent: "North America", code: "HN" },
  { continent: "North America", code: "JM" },
  { continent: "North America", code: "PA" },
  { continent: "Oceania", code: "AU" },
  { continent: "Oceania", code: "NZ" },
  { continent: "South America", code: "AR" },
  { continent: "South America", code: "BR" },
  { continent: "South America", code: "CL" },
  { continent: "South America", code: "CO" },
  { continent: "South America", code: "PE" },
  { continent: "South America", code: "UY" },
]

/**
 * GoCardless direct-debit collection countries (30 total).
 * Source: GoCardless Support — SEPA, BACS, BECS, PAD, Autogiro, Betalingsservice, etc.
 */
const GOCARDLESS_COUNTRIES: IntegrationCountry[] = [
  { continent: "Europe", code: "AT" },
  { continent: "Europe", code: "BE" },
  { continent: "Europe", code: "CH" },
  { continent: "Europe", code: "CY" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "DK" },
  { continent: "Europe", code: "EE" },
  { continent: "Europe", code: "ES" },
  { continent: "Europe", code: "FI" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "GR" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "IS" },
  { continent: "Europe", code: "IT" },
  { continent: "Europe", code: "LT" },
  { continent: "Europe", code: "LU" },
  { continent: "Europe", code: "LV" },
  { continent: "Europe", code: "MT" },
  { continent: "Europe", code: "NL" },
  { continent: "Europe", code: "NO" },
  { continent: "Europe", code: "PT" },
  { continent: "Europe", code: "SE" },
  { continent: "Europe", code: "SI" },
  { continent: "Europe", code: "SK" },
  { continent: "North America", code: "CA" },
  { continent: "North America", code: "US" },
  { continent: "Oceania", code: "AU" },
  { continent: "Oceania", code: "NZ" },
  { continent: "Africa", code: "ZA" },
]

/**
 * Square supported merchant countries (8 total).
 * Source: developer.squareup.com — Square Payments international availability.
 */
const SQUARE_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "ES" },
  { continent: "Asia", code: "JP" },
  { continent: "Oceania", code: "AU" },
]

/**
 * Authorize.Net supported merchant countries (3 total).
 * Source: Zoho Checkout / Authorize.Net Support — US, CA, AU only.
 * Note: no extra-count badge — full list fits on the card.
 */
const AUTHORIZE_NET_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "Oceania", code: "AU" },
]

/**
 * Mercado Pago supported merchant countries (8 total).
 * Source: Mercado Pago developer docs — Latin America + United States.
 */
const MERCADO_PAGO_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "MX" },
  { continent: "South America", code: "AR" },
  { continent: "South America", code: "BR" },
  { continent: "South America", code: "CL" },
  { continent: "South America", code: "CO" },
  { continent: "South America", code: "PE" },
  { continent: "South America", code: "UY" },
]

/**
 * Clover supported merchant countries (13 total).
 * Source: docs.clover.com — multi-market launch regions.
 */
const CLOVER_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "North America", code: "MX" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "AT" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "NL" },
  { continent: "Asia", code: "HK" },
  { continent: "Asia", code: "SG" },
  { continent: "Oceania", code: "AU" },
  { continent: "South America", code: "AR" },
  { continent: "South America", code: "BR" },
]

export const INTEGRATION_COUNTRIES: Record<string, IntegrationCountry[]> = {
  nmi: NMI_COUNTRIES,
  gocardless: GOCARDLESS_COUNTRIES,
  square: SQUARE_COUNTRIES,
  "authorize-net": AUTHORIZE_NET_COUNTRIES,
  "mercado-pago": MERCADO_PAGO_COUNTRIES,
  clover: CLOVER_COUNTRIES,
}

export function getIntegrationCountries(
  integrationId: string
): IntegrationCountry[] {
  return INTEGRATION_COUNTRIES[integrationId] ?? []
}

export function filterIntegrationCountries(
  countries: IntegrationCountry[],
  query: string
): IntegrationCountry[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return countries
  }

  return countries.filter(({ continent, code }) => {
    const label = getCountryLabel(code).toLowerCase()
    return (
      label.includes(normalized) ||
      continent.toLowerCase().includes(normalized) ||
      code.toLowerCase().includes(normalized)
    )
  })
}

const COUNTRY_CONTINENT = (() => {
  const map = new Map<string, Continent>()

  for (const countries of Object.values(INTEGRATION_COUNTRIES)) {
    for (const { code, continent } of countries) {
      map.set(code, continent)
    }
  }

  const extras: Array<[string, Continent]> = [
    ["NZ", "Oceania"],
    ["CZ", "Europe"],
    ["RO", "Europe"],
    ["BE", "Europe"],
    ["NL", "Europe"],
    ["AT", "Europe"],
    ["GR", "Europe"],
    ["PL", "Europe"],
  ]

  for (const [code, continent] of extras) {
    if (!map.has(code)) {
      map.set(code, continent)
    }
  }

  return map
})()

export function getCountryContinent(code: string): Continent {
  return COUNTRY_CONTINENT.get(code) ?? "Europe"
}

export function countriesFromCodes(codes: string[]): IntegrationCountry[] {
  const seen = new Set<string>()

  return codes
    .filter((code) => {
      if (seen.has(code)) {
        return false
      }

      seen.add(code)
      return true
    })
    .map((code) => ({
      code,
      continent: getCountryContinent(code),
    }))
    .sort((left, right) => {
      const continentCompare = left.continent.localeCompare(right.continent)
      if (continentCompare !== 0) {
        return continentCompare
      }

      return getCountryLabel(left.code).localeCompare(getCountryLabel(right.code))
    })
}
