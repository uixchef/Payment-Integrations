"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { FilterBarAnchor } from "@/components/integrations/integration-filter-bar"

export function useFilterBarState<T extends string>(
  filterIds: readonly T[],
  emptySelections: Record<T, string[]>,
  options?: {
    initialSelections?: Partial<Record<T, string[]>>
    initialPinned?: T[]
  }
) {
  const [openFilterId, setOpenFilterId] = useState<T | null>(null)
  const [openFilterAnchor, setOpenFilterAnchor] = useState<FilterBarAnchor | null>(
    null
  )
  const [pinnedFilterIds, setPinnedFilterIds] = useState<T[]>(
    options?.initialPinned ?? []
  )
  const [selections, setSelections] = useState<Record<T, string[]>>(() => ({
    ...emptySelections,
    ...options?.initialSelections,
  }))
  const [filterDraftIds, setFilterDraftIds] = useState<string[]>([])
  const filterStateRef = useRef({ openFilterId, openFilterAnchor })
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

  const visibleFilterTags = useMemo(() => {
    const withSelections = filterIds.filter((id) => selections[id].length > 0)
    const tags = new Set<T>([...withSelections, ...pinnedFilterIds])
    return filterIds.filter((id) => tags.has(id))
  }, [filterIds, selections, pinnedFilterIds])

  const pinFilter = useCallback((filterId: T) => {
    setPinnedFilterIds((current) =>
      current.includes(filterId) ? current : [...current, filterId]
    )
  }, [])

  const unpinFilter = useCallback((filterId: T) => {
    setPinnedFilterIds((current) => current.filter((id) => id !== filterId))
  }, [])

  const activateFilter = useCallback((filterId: T, anchor: FilterBarAnchor) => {
    setOpenFilterId(filterId)
    setOpenFilterAnchor(anchor)
  }, [])

  const closeFilter = useCallback(() => {
    setOpenFilterId(null)
    setOpenFilterAnchor(null)
  }, [])

  const tryUnpinFilter = useCallback(
    (filterId: T) => {
      if (selectionsRef.current[filterId].length === 0) {
        unpinFilter(filterId)
      }
    },
    [unpinFilter]
  )

  const handleFilterApply = useCallback(
    (filterId: T, ids: string[]) => {
      setSelections((current) => ({ ...current, [filterId]: ids }))
      closeFilter()

      if (ids.length === 0) {
        unpinFilter(filterId)
      }
    },
    [closeFilter, unpinFilter]
  )

  const handleToolbarFilterOpenChange = useCallback(
    (filterId: T, open: boolean) => {
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
    (filterId: T, open: boolean) => {
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
    (filterId: T) => {
      pinFilter(filterId)
      window.setTimeout(() => {
        activateFilter(filterId, "toolbar")
      }, 0)
    },
    [activateFilter, pinFilter]
  )

  const handleRemoveFilter = useCallback(
    (filterId: T) => {
      setSelections((current) => ({ ...current, [filterId]: [] }))
      unpinFilter(filterId)
      closeFilter()
    },
    [closeFilter, unpinFilter]
  )

  const handleClearFilters = useCallback(() => {
    setSelections(
      filterIds.reduce(
        (accumulator, filterId) => ({ ...accumulator, [filterId]: [] }),
        {} as Record<T, string[]>
      )
    )
    setPinnedFilterIds([])
    closeFilter()
  }, [closeFilter, filterIds])

  return {
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
  }
}
