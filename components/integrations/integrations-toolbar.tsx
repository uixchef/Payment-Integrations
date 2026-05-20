"use client"

import { Search } from "lucide-react"
import {
  IntegrationFilterBar,
  type IntegrationFilterAnchor,
} from "@/components/integrations/integration-filter-bar"
import { Input } from "@/components/ui/input"
import type { FilterType } from "@/lib/integration-filters"
import type { IntegrationFilterSelections } from "@/lib/filter-integrations"
import { cn } from "@/lib/utils"

export type IntegrationsViewMode = "grid" | "list"

function GridViewIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
    >
      <rect x="1.333" y="1.333" width="5.333" height="5.333" rx="0.667" stroke="currentColor" strokeWidth="1.333" />
      <rect x="9.333" y="1.333" width="5.333" height="5.333" rx="0.667" stroke="currentColor" strokeWidth="1.333" />
      <rect x="1.333" y="9.333" width="5.333" height="5.333" rx="0.667" stroke="currentColor" strokeWidth="1.333" />
      <rect x="9.333" y="9.333" width="5.333" height="5.333" rx="0.667" stroke="currentColor" strokeWidth="1.333" />
    </svg>
  )
}

function ListViewIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
    >
      <circle cx="2.667" cy="4" r="1" fill="currentColor" />
      <circle cx="2.667" cy="8" r="1" fill="currentColor" />
      <circle cx="2.667" cy="12" r="1" fill="currentColor" />
      <path d="M5.333 4H14M5.333 8H14M5.333 12H14" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" />
    </svg>
  )
}

type IntegrationsToolbarProps = {
  view: IntegrationsViewMode
  onViewChange: (view: IntegrationsViewMode) => void
  openFilterId: FilterType | null
  openFilterAnchor: IntegrationFilterAnchor | null
  selections: IntegrationFilterSelections
  filterDraftIds: string[]
  visibleFilterTags: FilterType[]
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: FilterType, ids: string[]) => void
  onToolbarFilterOpenChange: (filterId: FilterType, open: boolean) => void
  onAddFilter: (filterId: FilterType) => void
  onRemoveFilter: (filterId: FilterType) => void
}

export function IntegrationsToolbar({
  view,
  onViewChange,
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
}: IntegrationsToolbarProps) {
  const iconClass = (active: boolean) =>
    active ? "text-[#004eeb]" : "text-[#667085]"

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <IntegrationFilterBar
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
      />

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:max-w-[440px] sm:ml-auto">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#667085]"
            strokeWidth={2}
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search by provider, method, or country"
            aria-label="Search integrations"
            className="pl-8"
          />
        </div>

        <div
          className="flex h-9 shrink-0 overflow-hidden rounded border border-[#d0d5dd]"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            onClick={() => onViewChange("grid")}
            className={cn(
              "flex w-9 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155eef]/40",
              view === "grid"
                ? "bg-[#eff4ff]"
                : "bg-white hover:bg-slate-50"
            )}
          >
            <GridViewIcon className={iconClass(view === "grid")} />
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            aria-label="List view"
            onClick={() => onViewChange("list")}
            className={cn(
              "flex w-9 items-center justify-center border-l border-[#d0d5dd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155eef]/40",
              view === "list"
                ? "bg-[#eff4ff]"
                : "bg-white hover:bg-slate-50"
            )}
          >
            <ListViewIcon className={iconClass(view === "list")} />
          </button>
        </div>
      </div>
    </div>
  )
}
