"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { IntegrationCountriesPanel } from "@/components/integrations/integration-countries-panel"
import { INTEGRATIONS, type IntegrationItem } from "@/lib/integrations-data"

type IntegrationCountriesContextValue = {
  openCountriesPanel: (integrationId: string) => void
}

const IntegrationCountriesContext =
  createContext<IntegrationCountriesContextValue | null>(null)

export function IntegrationCountriesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<IntegrationItem | null>(null)

  const openCountriesPanel = useCallback((integrationId: string) => {
    const item = INTEGRATIONS.find((entry) => entry.id === integrationId) ?? null
    if (!item) {
      return
    }

    setActiveItem(item)
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({ openCountriesPanel }),
    [openCountriesPanel]
  )

  return (
    <IntegrationCountriesContext.Provider value={value}>
      {children}
      <IntegrationCountriesPanel
        item={activeItem}
        open={open}
        onOpenChange={setOpen}
      />
    </IntegrationCountriesContext.Provider>
  )
}

export function useIntegrationCountries() {
  const context = useContext(IntegrationCountriesContext)
  if (!context) {
    throw new Error(
      "useIntegrationCountries must be used within IntegrationCountriesProvider"
    )
  }
  return context
}
