"use client"

import { ExtraCountBadge, VIEW_ALL_CTA_THRESHOLD } from "@/components/integrations/extra-count-badge"
import {
  FilterDropdownPopover,
  type FilterBarAnchor,
} from "@/components/integrations/integration-filter-bar"
import { Switch } from "@/components/ui/switch"
import { flagAsset } from "@/lib/integration-assets"
import {
  PMC_FILTER_DEFINITIONS,
  type PmcFilterSelections,
  type PmcFilterType,
} from "@/lib/stripe-payment-method-filters"
import type {
  PaymentMethodTableRow,
  PopularInRegion,
} from "@/lib/stripe-payment-methods-data"
import { cn } from "@/lib/utils"
import {
  FilterLinesIcon,
  PaymentMethodIcon,
  RegionEarthIcon,
  RegionPublicIcon,
  TableHeaderIcon,
} from "./stripe-payment-methods-toolbar"

const HEADER_CELL =
  "flex h-9 items-center border-b border-[#d0d5dd] bg-[#f2f4f7] px-3"
const BODY_CELL = "flex h-11 items-center border-b border-[#d0d5dd] px-3"

function HeaderCell({
  icon,
  label,
  align = "left",
  className,
  filterId,
  filterOpen = false,
  onFilterOpenChange,
  filterSelectedIds = [],
  onFilterSelectedIdsChange,
  filterDraftIds,
  onFilterDraftIdsChange,
}: {
  icon: React.ReactNode
  label: string
  align?: "left" | "center"
  className?: string
  filterId?: PmcFilterType
  filterOpen?: boolean
  onFilterOpenChange?: (open: boolean) => void
  filterSelectedIds?: string[]
  onFilterSelectedIdsChange?: (ids: string[]) => void
  filterDraftIds?: string[]
  onFilterDraftIdsChange?: (ids: string[]) => void
}) {
  const hasFilter =
    filterId && onFilterOpenChange && onFilterSelectedIdsChange

  return (
    <div
      className={cn(
        HEADER_CELL,
        "border-r last:border-r-0",
        align === "center" && "justify-center",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1",
          align === "center" && "justify-center"
        )}
      >
        {icon}
        <span
          className={cn(
            "truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]",
            align === "center"
              ? "w-20 shrink-0 text-center"
              : "min-w-0 flex-1"
          )}
        >
          {label}
        </span>
        {hasFilter ? (
          <FilterDropdownPopover
            definition={PMC_FILTER_DEFINITIONS[filterId]}
            definitions={PMC_FILTER_DEFINITIONS}
            open={filterOpen}
            onOpenChange={onFilterOpenChange}
            selectedIds={filterSelectedIds}
            onSelectedIdsChange={onFilterSelectedIdsChange}
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

function PopularInCell({
  popularIn,
  onViewAllCountries,
}: {
  popularIn: PopularInRegion
  onViewAllCountries?: () => void
}) {
  if (popularIn.kind === "all-regions") {
    return (
      <div className="flex min-w-0 items-center gap-1">
        <RegionEarthIcon />
        <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          All regions
        </span>
      </div>
    )
  }

  if (popularIn.kind === "region") {
    return (
      <div className="flex min-w-0 items-center gap-1">
        <RegionPublicIcon />
        <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {popularIn.label}
        </span>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-1 overflow-hidden">
      {popularIn.countries.map((country, index) => (
        <div key={`${country.label}-${index}`} className="flex min-w-0 items-center gap-1">
          {index > 0 ? (
            <span className="shrink-0 text-[13px] leading-[18px] text-[#98a2b3]">,</span>
          ) : null}
          <div className="flex min-w-0 items-center gap-0.5">
            {country.flagCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={flagAsset(country.flagCode)}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full object-cover"
                aria-hidden
                draggable={false}
              />
            ) : (
              <RegionPublicIcon />
            )}
            <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
              {country.label}
            </span>
          </div>
        </div>
      ))}
      {popularIn.extraCount != null ? (
        <ExtraCountBadge
          count={popularIn.extraCount}
          tooltipFlags={popularIn.tooltipFlags}
          index={popularIn.countries.length}
          onViewAll={onViewAllCountries}
        />
      ) : null}
    </div>
  )
}

function PaymentMethodRow({
  row,
  enabled,
  onEnabledChange,
  onViewAllCountries,
}: {
  row: PaymentMethodTableRow
  enabled: boolean
  onEnabledChange: (next: boolean) => void
  onViewAllCountries?: () => void
}) {
  const rowTone = enabled ? "bg-[#f5f8ff]" : "bg-white"

  return (
    <div className="grid grid-cols-[minmax(220px,1.15fr)_minmax(180px,0.85fr)_minmax(280px,1.5fr)_140px]">
      <div className={cn(BODY_CELL, "gap-1", rowTone)}>
        <PaymentMethodIcon src={row.icon} name={row.name} />
        <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {row.name}
        </span>
      </div>
      <div className={cn(BODY_CELL, rowTone)}>
        <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {row.type}
        </span>
      </div>
      <div className={cn(BODY_CELL, "min-w-0", rowTone)}>
        <PopularInCell
          popularIn={row.popularIn}
          onViewAllCountries={
            row.popularIn.kind === "countries" &&
            row.popularIn.extraCount != null &&
            row.popularIn.extraCount > VIEW_ALL_CTA_THRESHOLD
              ? onViewAllCountries
              : undefined
          }
        />
      </div>
      <div className={cn(BODY_CELL, "justify-center", rowTone)}>
        <Switch
          size="sm"
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label={`${enabled ? "Disable" : "Enable"} ${row.name}`}
        />
      </div>
    </div>
  )
}

export function StripePaymentMethodsTable({
  rows,
  enabledById,
  onEnabledChange,
  onViewAllCountries,
  openFilterId,
  openFilterAnchor,
  selections,
  filterDraftIds,
  onFilterOpenChange,
  onFilterDraftIdsChange,
  onFilterApply,
}: {
  rows: PaymentMethodTableRow[]
  enabledById: Record<string, boolean>
  onEnabledChange: (id: string, next: boolean) => void
  onViewAllCountries?: (row: PaymentMethodTableRow) => void
  openFilterId: PmcFilterType | null
  openFilterAnchor: FilterBarAnchor | null
  selections: PmcFilterSelections
  filterDraftIds: string[]
  onFilterOpenChange: (filterId: PmcFilterType, open: boolean) => void
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: PmcFilterType, ids: string[]) => void
}) {
  return (
    <div className="overflow-x-auto rounded border border-[#d0d5dd]">
      <div className="min-w-[760px]">
          <div className="sticky top-0 z-10 grid grid-cols-[minmax(220px,1.15fr)_minmax(180px,0.85fr)_minmax(280px,1.5fr)_140px]">
            <HeaderCell
              icon={<TableHeaderIcon variant="payment-methods" />}
              label="Payment methods"
            />
            <HeaderCell
              icon={<TableHeaderIcon variant="type" />}
              label="Type"
              filterId="type"
              filterOpen={openFilterId === "type" && openFilterAnchor === "table"}
              onFilterOpenChange={(open) => onFilterOpenChange("type", open)}
              filterSelectedIds={selections.type}
              onFilterSelectedIdsChange={(ids) => onFilterApply("type", ids)}
              filterDraftIds={openFilterId === "type" ? filterDraftIds : undefined}
              onFilterDraftIdsChange={
                openFilterId === "type" ? onFilterDraftIdsChange : undefined
              }
            />
            <HeaderCell
              icon={<TableHeaderIcon variant="popular-in" />}
              label="Popular in"
              filterId="geographic-location"
              filterOpen={
                openFilterId === "geographic-location" &&
                openFilterAnchor === "table"
              }
              onFilterOpenChange={(open) =>
                onFilterOpenChange("geographic-location", open)
              }
              filterSelectedIds={selections["geographic-location"]}
              onFilterSelectedIdsChange={(ids) =>
                onFilterApply("geographic-location", ids)
              }
              filterDraftIds={
                openFilterId === "geographic-location" ? filterDraftIds : undefined
              }
              onFilterDraftIdsChange={
                openFilterId === "geographic-location"
                  ? onFilterDraftIdsChange
                  : undefined
              }
            />
            <HeaderCell
              icon={<TableHeaderIcon variant="enable" />}
              label="Enable"
              align="center"
            />
          </div>

          {rows.map((row) => (
            <PaymentMethodRow
              key={row.id}
              row={row}
              enabled={enabledById[row.id] ?? false}
              onEnabledChange={(next) => onEnabledChange(row.id, next)}
              onViewAllCountries={
                onViewAllCountries ? () => onViewAllCountries(row) : undefined
              }
            />
          ))}
      </div>
    </div>
  )
}
