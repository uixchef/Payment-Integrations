"use client"

import { Check, CreditCard, Globe, Plus, Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ADD_FILTER_OPTIONS,
  FILTER_DEFINITIONS,
  type FilterDefinition,
  type FilterOption,
  type FilterType,
} from "@/lib/integration-filters"
import { filterFlagAsset, INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationFilterSelections } from "@/lib/filter-integrations"
import { cn } from "@/lib/utils"

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) {
    return <>{text}</>
  }

  return (
    <>
      {text.slice(0, index)}
      <span className="text-[#155eef]">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  )
}

function FilterOptionIcon({ option }: { option: FilterOption }) {
  if (option.icon === "earth") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={INTEGRATION_ASSETS.filters.earth}
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0"
        aria-hidden
        draggable={false}
      />
    )
  }

  if (option.icon === "flag" && option.flagCode) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={filterFlagAsset(option.flagCode)}
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0"
        aria-hidden
        draggable={false}
      />
    )
  }

  return null
}

function FilterTagIcon({ filterId }: { filterId: FilterType }) {
  if (filterId === "payment-methods") {
    return <CreditCard className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
  }

  return <Globe className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
}

function FilterDropdownPanel({
  definition,
  selectedIds,
  onSelectedIdsChange,
  onApply,
}: {
  definition: FilterDefinition
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
  onApply: () => void
}) {
  const [query, setQuery] = useState("")

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return definition.options
    }

    return definition.options.filter((option) =>
      option.label.toLowerCase().includes(normalized)
    )
  }, [definition.options, query])

  const hasSelection = selectedIds.length > 0
  const trimmedQuery = query.trim()

  const statusLabel = trimmedQuery
    ? `Results for ‘${trimmedQuery}’`
    : hasSelection
      ? `${selectedIds.length} selected`
      : definition.emptyStatus

  const toggleOption = (optionId: string) => {
    onSelectedIdsChange(
      selectedIds.includes(optionId)
        ? selectedIds.filter((id) => id !== optionId)
        : [...selectedIds, optionId]
    )
  }

  return (
    <div className="flex w-[284px] flex-col overflow-hidden rounded border border-[#d0d5dd] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
      <div className="px-4 py-2">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#667085]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label={`Search ${definition.tagLabel.toLowerCase()}`}
            className={cn(
              "h-9 w-full rounded border border-[#d0d5dd] bg-white pl-8 pr-2",
              "font-[family-name:var(--font-inter)] text-base font-normal leading-6 text-[#101828]",
              "placeholder:text-[#475467] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]",
              "outline-none focus-visible:border-[#84adff] focus-visible:ring-4 focus-visible:ring-[#eff4ff]"
            )}
          />
        </div>
      </div>

      <div className="bg-[#f9fafb] px-4 pb-1 pt-2">
        <p className="font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#475467]">
          {statusLabel}
        </p>
      </div>

      <div className="max-h-[280px] overflow-y-auto overscroll-contain">
        {filteredOptions.map((option) => {
          const selected = selectedIds.includes(option.id)

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2 text-left outline-none",
                "font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]",
                selected
                  ? "bg-[#eff4ff] hover:bg-[#eff4ff]"
                  : "bg-white hover:bg-[#f2f4f7] focus-visible:bg-[#f2f4f7]"
              )}
            >
              <span
                className={cn(
                  "flex min-w-0 flex-1 items-center",
                  definition.id === "geographic-location" && "gap-1"
                )}
              >
                {definition.id === "geographic-location" && (
                  <FilterOptionIcon option={option} />
                )}
                <span className="min-w-0 truncate">
                  <HighlightMatch text={option.label} query={trimmedQuery} />
                </span>
              </span>
              {selected && (
                <Check
                  className="size-4 shrink-0 text-[#004eeb]"
                  strokeWidth={2.5}
                  aria-hidden
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="border-t border-[#d0d5dd] py-3">
        <div className="flex items-center gap-4 px-4">
          <button
            type="button"
            onClick={() =>
              onSelectedIdsChange(definition.options.map((option) => option.id))
            }
            className="cursor-pointer font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#344054] outline-none hover:text-[#101828]"
          >
            Select all
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => onSelectedIdsChange([])}
              className={cn(
                "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 outline-none",
                hasSelection
                  ? "cursor-pointer text-[#344054] hover:text-[#101828]"
                  : "cursor-not-allowed text-[#d0d5dd]"
              )}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onApply}
              className="cursor-pointer font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#004eeb] outline-none hover:text-[#155eef]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterDropdownPopover({
  filterId,
  open,
  onOpenChange,
  selectedIds,
  onSelectedIdsChange,
  trigger,
  draftIds: controlledDraftIds,
  onDraftIdsChange,
  align = "start",
  sideOffset = 8,
}: {
  filterId: FilterType
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
  trigger: ReactNode
  draftIds?: string[]
  onDraftIdsChange?: (ids: string[]) => void
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  const definition = FILTER_DEFINITIONS[filterId]
  const [internalDraftIds, setInternalDraftIds] = useState(selectedIds)
  const openedAtRef = useRef(0)
  const draftIds = controlledDraftIds ?? internalDraftIds
  const setDraftIds = onDraftIdsChange ?? setInternalDraftIds

  useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now()
    }
  }, [open])

  useEffect(() => {
    if (open && onDraftIdsChange === undefined) {
      setInternalDraftIds(selectedIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset internal draft only when panel opens
  }, [open, selectedIds])

  const shouldIgnoreDismiss = () => Date.now() - openedAtRef.current < 400

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && shouldIgnoreDismiss()) {
      return
    }

    onOpenChange(nextOpen)
  }

  const handleApply = () => {
    onSelectedIdsChange(draftIds)
    openedAtRef.current = 0
    onOpenChange(false)
  }

  return (
    <Popover modal open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className="border-0 bg-transparent p-0 shadow-none"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => {
          if (shouldIgnoreDismiss()) {
            event.preventDefault()
          }
        }}
        onFocusOutside={(event) => {
          if (shouldIgnoreDismiss()) {
            event.preventDefault()
          }
        }}
      >
        <FilterDropdownPanel
          definition={definition}
          selectedIds={draftIds}
          onSelectedIdsChange={setDraftIds}
          onApply={handleApply}
        />
      </PopoverContent>
    </Popover>
  )
}

function formatFilterTagValue(
  selectedIds: string[],
  options: FilterOption[]
): string | null {
  if (selectedIds.length === 0) {
    return null
  }

  const firstLabel =
    options.find((option) => option.id === selectedIds[0])?.label ?? selectedIds[0]

  if (selectedIds.length === 1) {
    return firstLabel
  }

  return `${firstLabel}, +${selectedIds.length - 1}`
}

function FilterTag({
  filterId,
  isActive,
  popoverOpen,
  onPopoverOpenChange,
  selectedIds,
  draftIds,
  onDraftIdsChange,
  onSelectedIdsChange,
  onRemove,
}: {
  filterId: FilterType
  isActive: boolean
  popoverOpen: boolean
  onPopoverOpenChange: (open: boolean) => void
  selectedIds: string[]
  draftIds: string[]
  onDraftIdsChange: (ids: string[]) => void
  onSelectedIdsChange: (ids: string[]) => void
  onRemove: () => void
}) {
  const definition = FILTER_DEFINITIONS[filterId]
  const displayIds = isActive ? draftIds : selectedIds
  const valueLabel = formatFilterTagValue(displayIds, definition.options)

  return (
    <div
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-0.5 rounded-[14px] border px-2",
        isActive
          ? "border-[#475467] bg-[#eaecf0] text-[#101828]"
          : "border-[#d0d5dd] bg-white text-[#344054]"
      )}
    >
      <FilterDropdownPopover
        filterId={filterId}
        open={popoverOpen}
        onOpenChange={onPopoverOpenChange}
        selectedIds={selectedIds}
        onSelectedIdsChange={onSelectedIdsChange}
        draftIds={draftIds}
        onDraftIdsChange={onDraftIdsChange}
        trigger={
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isActive}
            className={cn(
              "inline-flex min-w-0 items-center gap-0.5 outline-none",
              "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
              "focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
            )}
          >
            <FilterTagIcon filterId={filterId} />
            <span>{definition.tagLabel}</span>
            {valueLabel && (
              <span
                className={cn(
                  "rounded px-1.5",
                  isActive ? "bg-[#fcfcfd]" : "bg-[#f2f4f7]"
                )}
              >
                {valueLabel}
              </span>
            )}
          </button>
        }
      />
      <button
        type="button"
        aria-label={`Remove ${definition.tagLabel} filter`}
        onClick={onRemove}
        className={cn(
          "rounded-[10px] p-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40",
          isActive
            ? "bg-white hover:bg-[#f2f4f7]"
            : "opacity-50 hover:opacity-70"
        )}
      >
        <X className="size-3.5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

export type IntegrationFilterAnchor = "toolbar" | "table"

export type IntegrationFiltersController = {
  openFilterId: FilterType | null
  openFilterAnchor: IntegrationFilterAnchor | null
  selections: IntegrationFilterSelections
  filterDraftIds: string[]
  onOpenFilterIdChange: (filterId: FilterType | null) => void
  onOpenFilterAnchorChange: (anchor: IntegrationFilterAnchor | null) => void
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: FilterType, ids: string[]) => void
  activateFilter: (filterId: FilterType, anchor: IntegrationFilterAnchor) => void
  closeFilter: () => void
}

type IntegrationFilterBarProps = Pick<
  IntegrationFiltersController,
  | "openFilterId"
  | "openFilterAnchor"
  | "selections"
  | "filterDraftIds"
  | "onFilterDraftIdsChange"
  | "onFilterApply"
> & {
  visibleFilterTags: FilterType[]
  onToolbarFilterOpenChange: (filterId: FilterType, open: boolean) => void
  onAddFilter: (filterId: FilterType) => void
  onRemoveFilter: (filterId: FilterType) => void
}

export function IntegrationFilterBar({
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
}: IntegrationFilterBarProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  const availableAddOptions = ADD_FILTER_OPTIONS.filter(
    (option) => !visibleFilterTags.includes(option.id)
  )

  const handleAddFilterSelect = (filterId: FilterType) => {
    setAddMenuOpen(false)
    onAddFilter(filterId)
  }

  const removeFilter = (filterId: FilterType) => {
    onRemoveFilter(filterId)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {visibleFilterTags.map((filterId) => {
        const isActive = openFilterId === filterId

        return (
          <FilterTag
            key={filterId}
            filterId={filterId}
            isActive={isActive}
            popoverOpen={isActive && openFilterAnchor === "toolbar"}
            onPopoverOpenChange={(open) =>
              onToolbarFilterOpenChange(filterId, open)
            }
            selectedIds={selections[filterId]}
            draftIds={isActive ? filterDraftIds : selections[filterId]}
            onDraftIdsChange={onFilterDraftIdsChange}
            onSelectedIdsChange={(ids) => onFilterApply(filterId, ids)}
            onRemove={() => removeFilter(filterId)}
          />
        )
      })}

      {visibleFilterTags.length > 0 && availableAddOptions.length > 0 && (
        <div className="h-3.5 w-px shrink-0 bg-[#d0d5dd]" aria-hidden />
      )}

      {availableAddOptions.length > 0 && (
        <DropdownMenu open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-haspopup="menu"
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-0.5 rounded-[14px] border pl-2 pr-3 outline-none",
                "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
                "border-[#d0d5dd] bg-white text-[#344054] hover:bg-slate-50",
                "focus-visible:ring-2 focus-visible:ring-[#155eef]/40",
                "data-[state=open]:border-[#475467] data-[state=open]:bg-[#eaecf0] data-[state=open]:text-[#101828]"
              )}
            >
              <Plus className="size-[18px]" strokeWidth={2} aria-hidden />
              Add filter
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {availableAddOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onSelect={() => handleAddFilterSelect(option.id)}
              >
                {option.menuLabel}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export { FilterDropdownPopover }
