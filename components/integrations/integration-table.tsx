"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { IntegrationAvailability } from "@/components/integrations/integration-availability"
import { IntegrationProviderIdentity } from "@/components/integrations/integration-provider-identity"
import { IntegrationsPagination } from "@/components/integrations/integrations-pagination"
import {
  FilterDropdownPopover,
  type IntegrationFilterAnchor,
} from "@/components/integrations/integration-filter-bar"
import type { FilterType } from "@/lib/integration-filters"
import type { IntegrationFilterSelections } from "@/lib/filter-integrations"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"

const TABLE_COLUMNS =
  "grid grid-cols-[minmax(240px,1.15fr)_minmax(220px,1fr)_minmax(220px,1fr)_120px]"

const TABLE_ICONS = INTEGRATION_ASSETS.table

/** Below this count, all rows show without pagination and the table fits content. */
export const INTEGRATIONS_TABLE_PAGINATION_THRESHOLD = 10

const DEFAULT_PAGE_SIZE = 20

function TableHeaderIcon({
  src,
  className,
}: {
  src: string
  className: string
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("shrink-0", className)}
    />
  )
}

function TableHeaderCell({
  iconSrc,
  label,
  showFilter = true,
  centered = false,
  filterId,
  filterOpen = false,
  onFilterOpenChange,
  filterSelectedIds = [],
  onFilterSelectedIdsChange,
  filterDraftIds,
  onFilterDraftIdsChange,
}: {
  iconSrc: string
  label?: string
  showFilter?: boolean
  centered?: boolean
  filterId?: FilterType
  filterOpen?: boolean
  onFilterOpenChange?: (open: boolean) => void
  filterSelectedIds?: string[]
  onFilterSelectedIdsChange?: (ids: string[]) => void
  filterDraftIds?: string[]
  onFilterDraftIdsChange?: (ids: string[]) => void
}) {
  const hasFilter =
    showFilter &&
    label &&
    filterId &&
    onFilterOpenChange &&
    onFilterSelectedIdsChange

  return (
    <div
      className={cn(
        "flex h-9 items-center border-b border-r border-[#d0d5dd] bg-[#f2f4f7] px-3",
        centered && "justify-center"
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1",
          centered && "justify-center"
        )}
      >
        <TableHeaderIcon src={iconSrc} className="size-4" />
        {label ? (
          <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            {label}
          </span>
        ) : null}
        {hasFilter ? (
          <FilterDropdownPopover
            filterId={filterId}
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
                <TableHeaderIcon src={TABLE_ICONS.filterLines} className="size-3.5" />
              </button>
            }
          />
        ) : showFilter && label ? (
          <TableHeaderIcon src={TABLE_ICONS.filterLines} className="size-3.5" />
        ) : null}
      </div>
    </div>
  )
}

function TableRow({ item }: { item: IntegrationItem }) {
  return (
    <div
      className={cn(
        TABLE_COLUMNS,
        "group [--card-surface-color:white] transition-colors hover:bg-[#f5f8ff] hover:[--card-surface-color:#f5f8ff]"
      )}
    >
      <div className="flex h-16 items-center border-b border-r border-[#d0d5dd] px-3 py-2">
        <IntegrationProviderIdentity item={item} />
      </div>

      <div className="flex h-16 items-center border-b border-r border-[#d0d5dd] px-3 py-2">
        <p className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {item.methods}
        </p>
      </div>

      <div className="flex h-16 items-center border-b border-r border-[#d0d5dd] px-3 py-2">
        <IntegrationAvailability item={item} />
      </div>

      <div className="flex h-16 items-center border-b border-[#d0d5dd] px-3 py-1.5">
        <Button
          type="button"
          variant="outline"
          className="rounded border-[#d0d5dd] bg-white px-2.5 text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:border-[#84adff] hover:bg-white hover:text-[#004eeb]"
        >
          Connect
        </Button>
      </div>
    </div>
  )
}

type IntegrationTableProps = {
  className?: string
  items: IntegrationItem[]
  openFilterId: FilterType | null
  openFilterAnchor: IntegrationFilterAnchor | null
  selections: IntegrationFilterSelections
  filterDraftIds: string[]
  onFilterOpenChange: (filterId: FilterType, open: boolean) => void
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: FilterType, ids: string[]) => void
}

export function IntegrationTable({
  className,
  items,
  openFilterId,
  openFilterAnchor,
  selections,
  filterDraftIds,
  onFilterOpenChange,
  onFilterDraftIdsChange,
  onFilterApply,
}: IntegrationTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [items])

  const needsPagination = items.length >= INTEGRATIONS_TABLE_PAGINATION_THRESHOLD

  const displayItems = useMemo(() => {
    if (!needsPagination) {
      return items
    }

    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, needsPagination, page, pageSize])

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div
        className={cn(
          "grid w-full max-h-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded border border-[#d0d5dd] bg-white",
          needsPagination ? "min-h-0 flex-1" : "h-fit"
        )}
      >
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className={TABLE_COLUMNS} role="row">
              <TableHeaderCell
                iconSrc={TABLE_ICONS.creditCard}
                label="Integrations"
                showFilter={false}
              />
              <TableHeaderCell
                iconSrc={TABLE_ICONS.creditCard}
                label="Payment methods"
                filterId="payment-methods"
                filterOpen={
                  openFilterId === "payment-methods" &&
                  openFilterAnchor === "table"
                }
                onFilterOpenChange={(open) =>
                  onFilterOpenChange("payment-methods", open)
                }
                filterSelectedIds={selections["payment-methods"]}
                onFilterSelectedIdsChange={(ids) =>
                  onFilterApply("payment-methods", ids)
                }
                filterDraftIds={
                  openFilterId === "payment-methods" ? filterDraftIds : undefined
                }
                onFilterDraftIdsChange={
                  openFilterId === "payment-methods"
                    ? onFilterDraftIdsChange
                    : undefined
                }
              />
              <TableHeaderCell
                iconSrc={TABLE_ICONS.public}
                label="Geographic location"
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
                  openFilterId === "geographic-location"
                    ? filterDraftIds
                    : undefined
                }
                onFilterDraftIdsChange={
                  openFilterId === "geographic-location"
                    ? onFilterDraftIdsChange
                    : undefined
                }
              />
              <TableHeaderCell
                iconSrc={TABLE_ICONS.highlightMouseCursor}
                showFilter={false}
                centered
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-x-auto overflow-y-auto overscroll-y-contain">
          <div className="min-w-[800px]" role="rowgroup">
            {displayItems.map((item) => (
              <TableRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {needsPagination ? (
        <IntegrationsPagination
          total={items.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
    </div>
  )
}
