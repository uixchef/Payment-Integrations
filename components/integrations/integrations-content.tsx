"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IntegrationGrid } from "@/components/integrations/integration-grid"
import { IntegrationTable } from "@/components/integrations/integration-table"
import {
  IntegrationsToolbar,
  type IntegrationsViewMode,
} from "@/components/integrations/integrations-toolbar"
import type { IntegrationFilterAnchor } from "@/components/integrations/integration-filter-bar"
import type { FilterType } from "@/lib/integration-filters"
import {
  EMPTY_FILTER_SELECTIONS,
  filterIntegrations,
  getVisibleFilterTags,
  type IntegrationFilterSelections,
} from "@/lib/filter-integrations"
import { INTEGRATIONS } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"

type IntegrationsContentProps = {
  view: IntegrationsViewMode
  onViewChange: (view: IntegrationsViewMode) => void
}

export function IntegrationsContent({
  view,
  onViewChange,
}: IntegrationsContentProps) {
  const [openFilterId, setOpenFilterId] = useState<FilterType | null>(null)
  const [openFilterAnchor, setOpenFilterAnchor] =
    useState<IntegrationFilterAnchor | null>(null)
  const [pinnedFilterIds, setPinnedFilterIds] = useState<FilterType[]>([])
  const [selections, setSelections] =
    useState<IntegrationFilterSelections>(EMPTY_FILTER_SELECTIONS)
  const [filterDraftIds, setFilterDraftIds] = useState<string[]>([])
  const filterStateRef = useRef({
    openFilterId,
    openFilterAnchor,
  })
  const selectionsRef = useRef(selections)

  useEffect(() => {
    filterStateRef.current = { openFilterId, openFilterAnchor }
  }, [openFilterId, openFilterAnchor])

  useEffect(() => {
    selectionsRef.current = selections
  }, [selections])

  useEffect(() => {
    if (openFilterId) {
      setFilterDraftIds(selections[openFilterId])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed draft when a filter opens
  }, [openFilterId])

  const visibleFilterTags = useMemo(
    () => getVisibleFilterTags(selections, pinnedFilterIds),
    [selections, pinnedFilterIds]
  )

  const filteredIntegrations = useMemo(
    () => filterIntegrations(INTEGRATIONS, selections),
    [selections]
  )

  const pinFilter = useCallback((filterId: FilterType) => {
    setPinnedFilterIds((current) =>
      current.includes(filterId) ? current : [...current, filterId]
    )
  }, [])

  const unpinFilter = useCallback((filterId: FilterType) => {
    setPinnedFilterIds((current) => current.filter((id) => id !== filterId))
  }, [])

  const activateFilter = useCallback(
    (filterId: FilterType, anchor: IntegrationFilterAnchor) => {
      setOpenFilterId(filterId)
      setOpenFilterAnchor(anchor)
    },
    []
  )

  const closeFilter = useCallback(() => {
    setOpenFilterId(null)
    setOpenFilterAnchor(null)
  }, [])

  const tryUnpinFilter = useCallback(
    (filterId: FilterType) => {
      if (selectionsRef.current[filterId].length === 0) {
        unpinFilter(filterId)
      }
    },
    [unpinFilter]
  )

  const handleFilterApply = useCallback(
    (filterId: FilterType, ids: string[]) => {
      setSelections((current) => ({ ...current, [filterId]: ids }))
      closeFilter()

      if (ids.length === 0) {
        unpinFilter(filterId)
      }
    },
    [closeFilter, unpinFilter]
  )

  const handleToolbarFilterOpenChange = useCallback(
    (filterId: FilterType, open: boolean) => {
      if (open) {
        pinFilter(filterId)
        activateFilter(filterId, "toolbar")
        return
      }

      window.setTimeout(() => {
        const { openFilterId: id, openFilterAnchor: anchor } =
          filterStateRef.current

        if (id === filterId && anchor === "toolbar") {
          closeFilter()
          tryUnpinFilter(filterId)
        }
      }, 0)
    },
    [activateFilter, closeFilter, pinFilter, tryUnpinFilter]
  )

  const handleTableFilterOpenChange = useCallback(
    (filterId: FilterType, open: boolean) => {
      if (open) {
        pinFilter(filterId)
        activateFilter(filterId, "table")
        return
      }

      window.setTimeout(() => {
        const { openFilterId: id, openFilterAnchor: anchor } =
          filterStateRef.current

        if (id === filterId && anchor === "table") {
          closeFilter()
          tryUnpinFilter(filterId)
        }
      }, 0)
    },
    [activateFilter, closeFilter, pinFilter, tryUnpinFilter]
  )

  const handleAddFilter = useCallback(
    (filterId: FilterType) => {
      pinFilter(filterId)
      window.setTimeout(() => {
        activateFilter(filterId, "toolbar")
      }, 0)
    },
    [activateFilter, pinFilter]
  )

  const handleRemoveFilter = useCallback(
    (filterId: FilterType) => {
      setSelections((current) => ({ ...current, [filterId]: [] }))
      unpinFilter(filterId)
      closeFilter()
    },
    [closeFilter, unpinFilter]
  )

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        view === "list" && "min-h-0 flex-1"
      )}
    >
      <IntegrationsToolbar
        view={view}
        onViewChange={onViewChange}
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
      />
      {view === "grid" ? (
        <IntegrationGrid items={filteredIntegrations} />
      ) : (
        <IntegrationTable
          items={filteredIntegrations}
          openFilterId={openFilterId}
          openFilterAnchor={openFilterAnchor}
          selections={selections}
          filterDraftIds={filterDraftIds}
          onFilterOpenChange={handleTableFilterOpenChange}
          onFilterDraftIdsChange={setFilterDraftIds}
          onFilterApply={handleFilterApply}
        />
      )}
    </div>
  )
}

export type { IntegrationsViewMode }
