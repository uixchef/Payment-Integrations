"use client"

import { CountriesPanelEmptyState } from "@/components/integrations/countries-panel-empty-state"
import {
  FilterDropdownPopover,
  type FilterBarAnchor,
} from "@/components/integrations/integration-filter-bar"
import { getCountryLabel } from "@/lib/country-labels"
import type { IntegrationCountry } from "@/lib/integration-countries"
import {
  buildCountriesFilterDefinitions,
  type CountriesFilterType,
} from "@/lib/countries-panel-filters"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { cn } from "@/lib/utils"

const TABLE_COLUMNS = "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
const TABLE_ICONS = INTEGRATION_ASSETS.table

function TableHeaderIcon({
  src,
  className,
}: {
  src: string
  className: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("shrink-0", className)}
    />
  )
}

function FilterLinesIcon() {
  return <TableHeaderIcon src={TABLE_ICONS.filterLines} className="size-3.5" />
}

function CountriesTableHeaderCell({
  label,
  last = false,
  filterId,
  filterDefinitions,
  filterOpen = false,
  onFilterOpenChange,
  filterSelectedIds = [],
  onFilterSelectedIdsChange,
  filterDraftIds,
  onFilterDraftIdsChange,
}: {
  label: string
  last?: boolean
  filterId: CountriesFilterType
  filterDefinitions: ReturnType<typeof buildCountriesFilterDefinitions>
  filterOpen?: boolean
  onFilterOpenChange?: (open: boolean) => void
  filterSelectedIds?: string[]
  onFilterSelectedIdsChange?: (ids: string[]) => void
  filterDraftIds?: string[]
  onFilterDraftIdsChange?: (ids: string[]) => void
}) {
  const hasFilter = Boolean(onFilterOpenChange && onFilterSelectedIdsChange)

  return (
    <div
      className={cn(
        "flex h-9 items-center border-b border-[#d0d5dd] bg-[#f2f4f7] px-3",
        !last && "border-r"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {label}
        </span>
        {hasFilter ? (
          <FilterDropdownPopover
            definition={filterDefinitions[filterId]}
            definitions={filterDefinitions}
            open={filterOpen}
            onOpenChange={onFilterOpenChange!}
            selectedIds={filterSelectedIds}
            onSelectedIdsChange={onFilterSelectedIdsChange!}
            draftIds={filterDraftIds}
            onDraftIdsChange={onFilterDraftIdsChange}
            align="start"
            sideOffset={4}
            trigger={
              <button
                type="button"
                aria-label={`Filter ${label}`}
                aria-haspopup="dialog"
                aria-expanded={filterOpen}
                className={cn(
                  "shrink-0 rounded p-0.5 outline-none",
                  "hover:bg-[#eaecf0] focus-visible:ring-2 focus-visible:ring-[#155eef]/40",
                  filterOpen && "bg-[#eaecf0]"
                )}
              >
                <FilterLinesIcon />
              </button>
            }
          />
        ) : (
          <FilterLinesIcon />
        )}
      </div>
    </div>
  )
}

function CountriesTableRow({
  continent,
  country,
}: {
  continent: string
  country: string
}) {
  return (
    <div
      className={cn(
        TABLE_COLUMNS,
        "group transition-colors hover:bg-[#f5f8ff]"
      )}
    >
      <div className="flex h-9 items-center border-b border-r border-[#d0d5dd] px-3">
        <p className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {continent}
        </p>
      </div>
      <div className="flex h-9 items-center border-b border-[#d0d5dd] px-3">
        <p className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {country}
        </p>
      </div>
    </div>
  )
}

export function CountriesPanelTable({
  rows,
  filterDefinitions,
  openFilterId,
  openFilterAnchor,
  selections,
  filterDraftIds,
  onFilterOpenChange,
  onFilterDraftIdsChange,
  onFilterApply,
  onClearFilters,
}: {
  rows: IntegrationCountry[]
  filterDefinitions: ReturnType<typeof buildCountriesFilterDefinitions>
  openFilterId: CountriesFilterType | null
  openFilterAnchor: FilterBarAnchor | null
  selections: Record<CountriesFilterType, string[]>
  filterDraftIds: string[]
  onFilterOpenChange: (filterId: CountriesFilterType, open: boolean) => void
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: CountriesFilterType, ids: string[]) => void
  onClearFilters?: () => void
}) {
  return (
    <div className="grid min-h-0 max-h-full w-full flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded border border-[#d0d5dd] bg-white">
      <div className="overflow-x-auto">
        <div className={TABLE_COLUMNS} role="row">
          <CountriesTableHeaderCell
            label="Continent"
            filterId="continent"
            filterDefinitions={filterDefinitions}
            filterOpen={
              openFilterId === "continent" && openFilterAnchor === "table"
            }
            onFilterOpenChange={(open) => onFilterOpenChange("continent", open)}
            filterSelectedIds={selections.continent}
            onFilterSelectedIdsChange={(ids) => onFilterApply("continent", ids)}
            filterDraftIds={
              openFilterId === "continent" ? filterDraftIds : undefined
            }
            onFilterDraftIdsChange={
              openFilterId === "continent" ? onFilterDraftIdsChange : undefined
            }
          />
          <CountriesTableHeaderCell
            label="Country"
            last
            filterId="country"
            filterDefinitions={filterDefinitions}
            filterOpen={
              openFilterId === "country" && openFilterAnchor === "table"
            }
            onFilterOpenChange={(open) => onFilterOpenChange("country", open)}
            filterSelectedIds={selections.country}
            onFilterSelectedIdsChange={(ids) => onFilterApply("country", ids)}
            filterDraftIds={
              openFilterId === "country" ? filterDraftIds : undefined
            }
            onFilterDraftIdsChange={
              openFilterId === "country" ? onFilterDraftIdsChange : undefined
            }
          />
        </div>
      </div>

      <div className="min-h-0 overflow-x-auto overflow-y-auto overscroll-y-contain">
        {rows.length === 0 ? (
          <CountriesPanelEmptyState onClearFilters={onClearFilters} />
        ) : (
          <div role="rowgroup">
            {rows.map(({ continent, code }) => (
              <CountriesTableRow
                key={`${continent}-${code}`}
                continent={continent}
                country={getCountryLabel(code)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
