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

/** NMI merchant countries — Figma 2284:57652 (61 rows). */
const NMI_COUNTRIES: IntegrationCountry[] = [
  { continent: "Africa", code: "EG" },
  { continent: "Africa", code: "ZA" },
  { continent: "Africa", code: "MA" },
  { continent: "Africa", code: "NG" },
  { continent: "Africa", code: "KE" },
  { continent: "Africa", code: "GH" },
  { continent: "Africa", code: "TZ" },
  { continent: "Africa", code: "UG" },
  { continent: "Africa", code: "DZ" },
  { continent: "Africa", code: "ET" },
  { continent: "Africa", code: "SN" },
  { continent: "Asia", code: "IN" },
  { continent: "Asia", code: "JP" },
  { continent: "Asia", code: "CN" },
  { continent: "Asia", code: "SG" },
  { continent: "Asia", code: "MY" },
  { continent: "Asia", code: "PH" },
  { continent: "Asia", code: "ID" },
  { continent: "Asia", code: "TH" },
  { continent: "Asia", code: "KR" },
  { continent: "Asia", code: "AE" },
  { continent: "Asia", code: "SA" },
  { continent: "Asia", code: "IL" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "ES" },
  { continent: "Europe", code: "IT" },
  { continent: "Europe", code: "NL" },
  { continent: "Europe", code: "BE" },
  { continent: "Europe", code: "SE" },
  { continent: "Europe", code: "NO" },
  { continent: "Europe", code: "DK" },
  { continent: "Europe", code: "PL" },
  { continent: "Europe", code: "AT" },
  { continent: "Europe", code: "CH" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "PT" },
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "North America", code: "MX" },
  { continent: "North America", code: "CR" },
  { continent: "North America", code: "PA" },
  { continent: "North America", code: "GT" },
  { continent: "North America", code: "DO" },
  { continent: "North America", code: "JM" },
  { continent: "North America", code: "PR" },
  { continent: "North America", code: "SV" },
  { continent: "North America", code: "HN" },
  { continent: "North America", code: "NI" },
  { continent: "Oceania", code: "AU" },
  { continent: "Oceania", code: "NZ" },
  { continent: "Oceania", code: "FJ" },
  { continent: "Oceania", code: "PG" },
  { continent: "Oceania", code: "WS" },
  { continent: "South America", code: "BR" },
  { continent: "South America", code: "AR" },
  { continent: "South America", code: "CL" },
  { continent: "South America", code: "CO" },
  { continent: "South America", code: "PE" },
  { continent: "South America", code: "UY" },
]

const GOCARDLESS_COUNTRIES: IntegrationCountry[] = [
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "ES" },
  { continent: "Europe", code: "IT" },
  { continent: "Europe", code: "NL" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "BE" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "AT" },
  { continent: "Europe", code: "PT" },
  { continent: "Europe", code: "SE" },
  { continent: "Europe", code: "DK" },
  { continent: "Europe", code: "FI" },
  { continent: "Europe", code: "PL" },
  { continent: "Europe", code: "CH" },
  { continent: "Europe", code: "NO" },
]

const SQUARE_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "North America", code: "MX" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "ES" },
  { continent: "Europe", code: "IE" },
  { continent: "Asia", code: "JP" },
  { continent: "Oceania", code: "AU" },
]

const AUTHORIZE_NET_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "FR" },
  { continent: "Oceania", code: "AU" },
  { continent: "Asia", code: "IN" },
  { continent: "Asia", code: "JP" },
  { continent: "South America", code: "AR" },
  { continent: "South America", code: "UY" },
]

const CLOVER_COUNTRIES: IntegrationCountry[] = [
  { continent: "North America", code: "US" },
  { continent: "North America", code: "CA" },
  { continent: "Asia", code: "IN" },
  { continent: "Africa", code: "GN" },
  { continent: "South America", code: "UY" },
  { continent: "Asia", code: "KG" },
  { continent: "Europe", code: "GB" },
  { continent: "Europe", code: "DE" },
  { continent: "Europe", code: "FR" },
  { continent: "Europe", code: "IT" },
  { continent: "Europe", code: "ES" },
  { continent: "Europe", code: "NL" },
  { continent: "Europe", code: "IE" },
  { continent: "Europe", code: "AT" },
  { continent: "Europe", code: "BE" },
  { continent: "Europe", code: "PT" },
]

export const INTEGRATION_COUNTRIES: Record<string, IntegrationCountry[]> = {
  nmi: NMI_COUNTRIES,
  gocardless: GOCARDLESS_COUNTRIES,
  square: SQUARE_COUNTRIES,
  "authorize-net": AUTHORIZE_NET_COUNTRIES,
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
