"use client"

import { Check, CreditCard, Globe, Plus, Search, X } from "lucide-react"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

function FilterTagIcon({
  filterId,
  renderFilterIcon,
}: {
  filterId: string
  renderFilterIcon?: (filterId: string) => ReactNode
}) {
  if (renderFilterIcon) {
    const icon = renderFilterIcon(filterId)
    if (!icon) {
      return null
    }

    return <>{icon}</>
  }

  if (filterId === "payment-methods") {
    return <CreditCard className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
  }

  return <Globe className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
}

export function pmcFilterIcon(filterId: string): ReactNode {
  if (filterId === "product-area") {
    return null
  }

  if (filterId === "type") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={INTEGRATION_ASSETS.table.sell}
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

function FilterDropdownPanel({
  definition,
  selectedIds,
  onSelectedIdsChange,
  onApply,
  onSingleSelect,
}: {
  definition: FilterDefinition
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
  onApply: () => void
  onSingleSelect?: (optionId: string) => void
}) {
  const [query, setQuery] = useState("")
  const isSingleSelect = definition.selectionMode === "single"
  const showStatusBar = definition.showStatusBar !== false
  const showFooter = definition.showFooter !== false

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

  const handleOptionClick = (optionId: string) => {
    if (isSingleSelect && onSingleSelect) {
      onSingleSelect(optionId)
      return
    }

    toggleOption(optionId)
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

      {showStatusBar ? (
        <div className="bg-[#f9fafb] px-4 pb-1 pt-2">
          <p className="font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#475467]">
            {statusLabel}
          </p>
        </div>
      ) : null}

      <div className="max-h-[280px] overflow-y-auto overscroll-contain">
        {filteredOptions.map((option) => {
          const selected = selectedIds.includes(option.id)

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => handleOptionClick(option.id)}
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

      {showFooter ? (
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
      ) : null}
    </div>
  )
}

function FilterDropdownPopover({
  filterId,
  definition: definitionProp,
  definitions = FILTER_DEFINITIONS,
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
  filterId?: FilterType
  definition?: FilterDefinition
  definitions?: Record<string, FilterDefinition>
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
  const definition =
    definitionProp ?? (filterId ? definitions[filterId] : undefined)

  if (!definition) {
    return <>{trigger}</>
  }
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

  const handleSingleSelect = (optionId: string) => {
    onSelectedIdsChange([optionId])
    openedAtRef.current = 0
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className="z-[110] border-0 bg-transparent p-0 shadow-none"
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
          onSingleSelect={
            definition.selectionMode === "single" ? handleSingleSelect : undefined
          }
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

function FilterTag<T extends string>({
  filterId,
  definition,
  isActive,
  popoverOpen,
  onPopoverOpenChange,
  selectedIds,
  draftIds,
  onDraftIdsChange,
  onSelectedIdsChange,
  onRemove,
  renderFilterIcon,
  removable = true,
  compact = false,
}: {
  filterId: T
  definition: FilterDefinition
  isActive: boolean
  popoverOpen: boolean
  onPopoverOpenChange: (open: boolean) => void
  selectedIds: string[]
  draftIds: string[]
  onDraftIdsChange: (ids: string[]) => void
  onSelectedIdsChange: (ids: string[]) => void
  onRemove: () => void
  renderFilterIcon?: (filterId: string) => ReactNode
  removable?: boolean
  compact?: boolean
}) {
  const displayIds = isActive ? draftIds : selectedIds
  const valueLabel = formatFilterTagValue(displayIds, definition.options)

  return (
    <div
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-0.5 rounded-[14px] border px-2",
        !removable && "pr-3",
        isActive
          ? "border-[#475467] bg-[#eaecf0] text-[#101828]"
          : "border-[#d0d5dd] bg-white text-[#344054]"
      )}
    >
      <FilterDropdownPopover
        definition={definition}
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
              compact
                ? "font-[family-name:var(--font-inter)] text-[13px] font-medium leading-[18px] text-[#475467]"
                : "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
              "focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
            )}
          >
            <FilterTagIcon filterId={filterId} renderFilterIcon={renderFilterIcon} />
            <span>{definition.tagLabel}</span>
            {valueLabel && (
              <span
                className={cn(
                  compact ? "rounded px-1.5 text-[13px] leading-[18px]" : "rounded px-1.5",
                  isActive ? "bg-[#fcfcfd]" : "bg-[#f2f4f7]"
                )}
              >
                {valueLabel}
              </span>
            )}
          </button>
        }
      />
      {removable ? (
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
      ) : null}
    </div>
  )
}

function FilterOverflowBadge<T extends string>({
  count,
  overflowTagIds,
  filterDefinitions,
  openFilterId,
  openFilterAnchor,
  selections,
  filterDraftIds,
  nonRemovableFilterIds,
  onFilterDraftIdsChange,
  onFilterApply,
  onToolbarFilterOpenChange,
  onRemoveFilter,
  renderFilterIcon,
}: {
  count: number
  overflowTagIds: T[]
  filterDefinitions: Record<T, FilterDefinition>
  openFilterId: T | null
  openFilterAnchor: FilterBarAnchor | null
  selections: Record<T, string[]>
  filterDraftIds: string[]
  nonRemovableFilterIds: T[]
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: T, ids: string[]) => void
  onToolbarFilterOpenChange: (filterId: T, open: boolean) => void
  onRemoveFilter: (filterId: T) => void
  renderFilterIcon?: (filterId: string) => ReactNode
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <TooltipProvider disableHoverableContent={false} delayDuration={200}>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`${count} more filters. Hover or click to view.`}
            onClick={() => setTooltipOpen((open) => !open)}
            className={cn(
              "inline-flex h-7 shrink-0 items-center justify-center rounded-[14px] border px-2 outline-none",
              "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
              "border-[#d0d5dd] bg-white text-[#344054] hover:bg-slate-50",
              "focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
            )}
          >
            +{count}
          </button>
        </TooltipTrigger>
        <TooltipContent
          fitContent
          side="bottom"
          align="start"
          sideOffset={6}
          className="rounded p-2"
        >
          <div className="flex flex-wrap gap-2">
            {overflowTagIds.map((filterId) => {
              const isActive = openFilterId === filterId
              const definition = filterDefinitions[filterId]

              return (
                <FilterTag
                  key={filterId}
                  filterId={filterId}
                  definition={definition}
                  compact
                  isActive={isActive}
                  popoverOpen={isActive && openFilterAnchor === "toolbar"}
                  onPopoverOpenChange={(open) => {
                    if (open) {
                      setTooltipOpen(false)
                    }
                    onToolbarFilterOpenChange(filterId, open)
                  }}
                  selectedIds={selections[filterId]}
                  draftIds={isActive ? filterDraftIds : selections[filterId]}
                  onDraftIdsChange={onFilterDraftIdsChange}
                  onSelectedIdsChange={(ids) => onFilterApply(filterId, ids)}
                  onRemove={() => onRemoveFilter(filterId)}
                  removable={!nonRemovableFilterIds.includes(filterId)}
                  renderFilterIcon={
                    renderFilterIcon ? (id) => renderFilterIcon(id) : undefined
                  }
                />
              )
            })}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export type FilterBarAnchor = "toolbar" | "table"

/** @deprecated Use FilterBarAnchor */
export type IntegrationFilterAnchor = FilterBarAnchor

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

type ConfigurableFilterBarProps<T extends string> = {
  filterDefinitions: Record<T, FilterDefinition>
  addFilterOptions: Array<{ id: T; menuLabel: string }>
  openFilterId: T | null
  openFilterAnchor: FilterBarAnchor | null
  selections: Record<T, string[]>
  filterDraftIds: string[]
  visibleFilterTags: T[]
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: T, ids: string[]) => void
  onToolbarFilterOpenChange: (filterId: T, open: boolean) => void
  onAddFilter: (filterId: T) => void
  onRemoveFilter: (filterId: T) => void
  renderFilterIcon?: (filterId: string) => ReactNode
  nonRemovableFilterIds?: T[]
  /** Collapse tags after the first into a +N tooltip — for narrow toolbars (e.g. side panels). */
  collapseOverflowTags?: boolean
}

export function ConfigurableFilterBar<T extends string>({
  filterDefinitions,
  addFilterOptions,
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
  renderFilterIcon,
  nonRemovableFilterIds = [],
  collapseOverflowTags = false,
}: ConfigurableFilterBarProps<T>) {
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  const availableAddOptions = addFilterOptions.filter(
    (option) => !visibleFilterTags.includes(option.id)
  )

  const visibleTags = collapseOverflowTags
    ? visibleFilterTags.length <= 1
      ? visibleFilterTags
      : visibleFilterTags.slice(0, 1)
    : visibleFilterTags
  const overflowTags = collapseOverflowTags
    ? visibleFilterTags.length <= 1
      ? []
      : visibleFilterTags.slice(1)
    : []
  const overflowCount = overflowTags.length

  const handleAddFilterSelect = (filterId: T) => {
    setAddMenuOpen(false)
    onAddFilter(filterId)
  }

  const renderToolbarFilterTag = (filterId: T) => {
    const isActive = openFilterId === filterId
    const definition = filterDefinitions[filterId]

    return (
      <FilterTag
        key={filterId}
        filterId={filterId}
        definition={definition}
        isActive={isActive}
        popoverOpen={isActive && openFilterAnchor === "toolbar"}
        onPopoverOpenChange={(open) => onToolbarFilterOpenChange(filterId, open)}
        selectedIds={selections[filterId]}
        draftIds={isActive ? filterDraftIds : selections[filterId]}
        onDraftIdsChange={onFilterDraftIdsChange}
        onSelectedIdsChange={(ids) => onFilterApply(filterId, ids)}
        onRemove={() => onRemoveFilter(filterId)}
        removable={!nonRemovableFilterIds.includes(filterId)}
        renderFilterIcon={
          renderFilterIcon ? (id) => renderFilterIcon(id) : undefined
        }
      />
    )
  }

  return (
    <div className="flex w-fit max-w-full min-w-0 items-center gap-2">
      {visibleTags.map((filterId) => renderToolbarFilterTag(filterId))}

      {overflowCount > 0 ? (
        <FilterOverflowBadge
          count={overflowCount}
          overflowTagIds={overflowTags}
          filterDefinitions={filterDefinitions}
          openFilterId={openFilterId}
          openFilterAnchor={openFilterAnchor}
          selections={selections}
          filterDraftIds={filterDraftIds}
          nonRemovableFilterIds={nonRemovableFilterIds}
          onFilterDraftIdsChange={onFilterDraftIdsChange}
          onFilterApply={onFilterApply}
          onToolbarFilterOpenChange={onToolbarFilterOpenChange}
          onRemoveFilter={onRemoveFilter}
          renderFilterIcon={renderFilterIcon}
        />
      ) : null}

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
          <DropdownMenuContent align="start" className="z-[110]">
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

export function IntegrationFilterBar(props: IntegrationFilterBarProps) {
  return (
    <ConfigurableFilterBar<FilterType>
      filterDefinitions={FILTER_DEFINITIONS}
      addFilterOptions={ADD_FILTER_OPTIONS as Array<{
        id: FilterType
        menuLabel: string
      }>}
      {...props}
    />
  )
}

export { FilterDropdownPopover }
