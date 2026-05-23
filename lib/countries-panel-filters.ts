import type { FilterDefinition } from "@/lib/integration-filters"
import { getCountryLabel } from "@/lib/country-labels"
import {
  filterIntegrationCountries,
  type IntegrationCountry,
} from "@/lib/integration-countries"

export type CountriesFilterType = "continent" | "country"

export const COUNTRIES_FILTER_TYPES: CountriesFilterType[] = [
  "continent",
  "country",
]

export type CountriesFilterSelections = Record<CountriesFilterType, string[]>

export const COUNTRIES_EMPTY_FILTER_SELECTIONS: CountriesFilterSelections = {
  continent: [],
  country: [],
}

export const COUNTRIES_ADD_FILTER_OPTIONS: Array<{
  id: CountriesFilterType
  menuLabel: string
}> = [
  { id: "continent", menuLabel: "Continent" },
  { id: "country", menuLabel: "Country" },
]

export function buildCountriesFilterDefinitions(
  countries: IntegrationCountry[]
): Record<CountriesFilterType, FilterDefinition> {
  const continents = [...new Set(countries.map(({ continent }) => continent))].sort(
    (left, right) => left.localeCompare(right)
  )

  const countryOptions = countries
    .map(({ code }) => ({
      id: code,
      label: getCountryLabel(code),
      icon: "flag" as const,
      flagCode: code,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))

  return {
    continent: {
      id: "continent",
      tagLabel: "Continent",
      menuLabel: "Continent",
      emptyStatus: "No continents selected yet",
      options: continents.map((continent) => ({
        id: continent,
        label: continent,
      })),
    },
    country: {
      id: "country",
      tagLabel: "Country",
      menuLabel: "Country",
      emptyStatus: "No countries selected yet",
      options: countryOptions,
    },
  }
}

function matchesContinent(
  country: IntegrationCountry,
  selectedContinents: string[]
): boolean {
  if (selectedContinents.length === 0) {
    return true
  }

  return selectedContinents.includes(country.continent)
}

function matchesCountry(
  country: IntegrationCountry,
  selectedCountries: string[]
): boolean {
  if (selectedCountries.length === 0) {
    return true
  }

  return selectedCountries.includes(country.code)
}

export function filterCountriesPanelRows(
  countries: IntegrationCountry[],
  selections: CountriesFilterSelections,
  searchQuery: string
): IntegrationCountry[] {
  const searchMatches = filterIntegrationCountries(countries, searchQuery)

  if (
    selections.continent.length === 0 &&
    selections.country.length === 0
  ) {
    return searchMatches
  }

  return searchMatches.filter(
    (row) =>
      matchesContinent(row, selections.continent) &&
      matchesCountry(row, selections.country)
  )
}
