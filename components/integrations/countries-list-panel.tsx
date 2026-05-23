"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Globe, Search } from "lucide-react"
import { ConfigurableFilterBar } from "@/components/integrations/integration-filter-bar"
import { CountriesPanelTable } from "@/components/integrations/countries-panel-table"
import {
  Sheet,
  SheetBody,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFilterBarState } from "@/hooks/use-filter-bar-state"
import {
  buildCountriesFilterDefinitions,
  COUNTRIES_ADD_FILTER_OPTIONS,
  COUNTRIES_EMPTY_FILTER_SELECTIONS,
  COUNTRIES_FILTER_TYPES,
  filterCountriesPanelRows,
  type CountriesFilterType,
} from "@/lib/countries-panel-filters"
import type { IntegrationCountry } from "@/lib/integration-countries"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { cn } from "@/lib/utils"

const TABLE_ICONS = INTEGRATION_ASSETS.table

function countriesPanelFilterIcon(filterId: string) {
  if (filterId === "country") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={TABLE_ICONS.public}
        alt=""
        width={18}
        height={18}
        className="size-[18px] shrink-0"
        aria-hidden
        draggable={false}
      />
    )
  }

  return <Globe className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
}

function CountriesPanelToolbar({
  filterDefinitions,
  searchQuery,
  onSearchChange,
  openFilterId,
  openFilterAnchor,
  selections,
  filterDraftIds,
  visibleFilterTags,
  onFilterDraftIdsChange,
  onFilterApply,
  onToolbarFilterOpenChange,
  onAddFilter,
  onRemoveFilter,
  searchAriaLabel,
}: {
  filterDefinitions: ReturnType<typeof buildCountriesFilterDefinitions>
  searchQuery: string
  onSearchChange: (query: string) => void
  openFilterId: CountriesFilterType | null
  openFilterAnchor: "toolbar" | "table" | null
  selections: Record<CountriesFilterType, string[]>
  filterDraftIds: string[]
  visibleFilterTags: CountriesFilterType[]
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: CountriesFilterType, ids: string[]) => void
  onToolbarFilterOpenChange: (filterId: CountriesFilterType, open: boolean) => void
  onAddFilter: (filterId: CountriesFilterType) => void
  onRemoveFilter: (filterId: CountriesFilterType) => void
  searchAriaLabel: string
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2">
      <ConfigurableFilterBar<CountriesFilterType>
        filterDefinitions={filterDefinitions}
        addFilterOptions={COUNTRIES_ADD_FILTER_OPTIONS}
        openFilterId={openFilterId}
        openFilterAnchor={openFilterAnchor}
        selections={selections}
        filterDraftIds={filterDraftIds}
        visibleFilterTags={visibleFilterTags}
        onFilterDraftIdsChange={onFilterDraftIdsChange}
        onFilterApply={onFilterApply}
        onToolbarFilterOpenChange={onToolbarFilterOpenChange}
        onAddFilter={onAddFilter}
        onRemoveFilter={onRemoveFilter}
        renderFilterIcon={countriesPanelFilterIcon}
        collapseOverflowTags
      />

      <div className="flex min-w-0 flex-1 items-center justify-end">
        <label className="relative w-full max-w-[160px]">
          <span className="sr-only">{searchAriaLabel}</span>
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#667085]"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            aria-label={searchAriaLabel}
            className={cn(
              "h-9 w-full rounded border border-[#d0d5dd] bg-white py-0 pl-8 pr-2",
              "font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828]",
              "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#475467]",
              "focus-visible:border-[#84adff] focus-visible:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
            )}
          />
        </label>
      </div>
    </div>
  )
}

function CountriesPanelBody({
  countries,
  searchAriaLabel,
}: {
  countries: IntegrationCountry[]
  searchAriaLabel: string
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const filterDefinitions = useMemo(
    () => buildCountriesFilterDefinitions(countries),
    [countries]
  )

  const {
    openFilterId,
    openFilterAnchor,
    selections,
    filterDraftIds,
    visibleFilterTags,
    setFilterDraftIds,
    handleFilterApply,
    handleToolbarFilterOpenChange,
    handleTableFilterOpenChange,
    handleAddFilter,
    handleRemoveFilter,
    handleClearFilters,
  } = useFilterBarState(
    COUNTRIES_FILTER_TYPES,
    COUNTRIES_EMPTY_FILTER_SELECTIONS
  )

  const rows = useMemo(
    () => filterCountriesPanelRows(countries, selections, searchQuery),
    [countries, selections, searchQuery]
  )

  const handleClearAll = () => {
    setSearchQuery("")
    handleClearFilters()
  }

  const hasActiveSearchOrFilters =
    searchQuery.trim().length > 0 ||
    selections.continent.length > 0 ||
    selections.country.length > 0

  return (
    <>
      <CountriesPanelToolbar
        filterDefinitions={filterDefinitions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        openFilterId={openFilterId}
        openFilterAnchor={openFilterAnchor}
        selections={selections}
        filterDraftIds={filterDraftIds}
        visibleFilterTags={visibleFilterTags}
        onFilterDraftIdsChange={setFilterDraftIds}
        onFilterApply={handleFilterApply}
        onToolbarFilterOpenChange={handleToolbarFilterOpenChange}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
        searchAriaLabel={searchAriaLabel}
      />

      <CountriesPanelTable
        rows={rows}
        filterDefinitions={filterDefinitions}
        openFilterId={openFilterId}
        openFilterAnchor={openFilterAnchor}
        selections={selections}
        filterDraftIds={filterDraftIds}
        onFilterOpenChange={handleTableFilterOpenChange}
        onFilterDraftIdsChange={setFilterDraftIds}
        onFilterApply={handleFilterApply}
        onClearFilters={hasActiveSearchOrFilters ? handleClearAll : undefined}
      />
    </>
  )
}

export type CountriesListPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sheetTitle: string
  header: ReactNode
  countries: IntegrationCountry[]
  searchAriaLabel?: string
}

export function CountriesListPanel({
  open,
  onOpenChange,
  sheetTitle,
  header,
  countries,
  searchAriaLabel = "Search countries",
}: CountriesListPanelProps) {
  const [sessionKey, setSessionKey] = useState(0)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSessionKey((current) => current + 1)
    }
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle>{sheetTitle}</SheetTitle>
        <SheetHeader>
          {header}
          <SheetCloseButton />
        </SheetHeader>
        <SheetBody>
          <CountriesPanelBody
            key={sessionKey}
            countries={countries}
            searchAriaLabel={searchAriaLabel}
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
