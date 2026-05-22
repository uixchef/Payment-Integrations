"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { INTEGRATIONS } from "@/lib/integrations-data"

type ConnectedMap = Record<string, boolean>

type IntegrationStatusContextValue = {
  defaultProviderId: string | null
  isConnected: (id: string) => boolean
  isDefault: (id: string) => boolean
  getDefaultProviderName: () => string | null
  setConnected: (id: string, value: boolean) => void
  setDefaultProvider: (id: string) => void
  clearDefaultProvider: () => void
}

const IntegrationStatusContext =
  createContext<IntegrationStatusContextValue | null>(null)

function seedConnected(): ConnectedMap {
  const map: ConnectedMap = {}
  for (const item of INTEGRATIONS) {
    if (item.connected) map[item.id] = true
  }
  return map
}

const INITIAL_DEFAULT_ID: string | null =
  INTEGRATIONS.find((item) => item.connected)?.id ?? null

export function IntegrationStatusProvider({ children }: { children: ReactNode }) {
  const [connectedMap, setConnectedMap] = useState<ConnectedMap>(() =>
    seedConnected()
  )
  const [defaultProviderId, setDefaultProviderId] = useState<string | null>(
    INITIAL_DEFAULT_ID
  )

  const isConnected = useCallback(
    (id: string) => Boolean(connectedMap[id]),
    [connectedMap]
  )

  const isDefault = useCallback(
    (id: string) => defaultProviderId === id,
    [defaultProviderId]
  )

  const getDefaultProviderName = useCallback(() => {
    if (!defaultProviderId) return null
    return (
      INTEGRATIONS.find((item) => item.id === defaultProviderId)?.name ?? null
    )
  }, [defaultProviderId])

  const setConnected = useCallback(
    (id: string, value: boolean) => {
      setConnectedMap((prev) => {
        if (Boolean(prev[id]) === value) return prev
        const next = { ...prev }
        if (value) next[id] = true
        else delete next[id]
        return next
      })
      if (!value) {
        setDefaultProviderId((prev) => (prev === id ? null : prev))
      }
    },
    []
  )

  const setDefaultProvider = useCallback((id: string) => {
    setConnectedMap((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
    setDefaultProviderId(id)
  }, [])

  const clearDefaultProvider = useCallback(() => {
    setDefaultProviderId(null)
  }, [])

  const value = useMemo<IntegrationStatusContextValue>(
    () => ({
      defaultProviderId,
      isConnected,
      isDefault,
      getDefaultProviderName,
      setConnected,
      setDefaultProvider,
      clearDefaultProvider,
    }),
    [
      defaultProviderId,
      isConnected,
      isDefault,
      getDefaultProviderName,
      setConnected,
      setDefaultProvider,
      clearDefaultProvider,
    ]
  )

  return (
    <IntegrationStatusContext.Provider value={value}>
      {children}
    </IntegrationStatusContext.Provider>
  )
}

export function useIntegrationStatus(): IntegrationStatusContextValue {
  const ctx = useContext(IntegrationStatusContext)
  if (!ctx) {
    throw new Error(
      "useIntegrationStatus must be used inside IntegrationStatusProvider"
    )
  }
  return ctx
}
