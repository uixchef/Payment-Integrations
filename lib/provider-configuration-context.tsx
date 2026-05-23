"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  MAX_PROVIDERS_PER_CHANNEL,
  PAYMENT_CHANNELS,
  type PaymentChannel,
} from "@/lib/provider-configuration-data"

export type ChannelAssignments = Record<string, string[]>

type PendingRemoval = {
  channelId: string
  optionId: string
}

type ProviderConfigurationContextValue = {
  assignments: ChannelAssignments
  getChannelProviders: (channelId: string) => string[]
  toggleProviderOption: (channelId: string, optionId: string) => boolean
  requestRemoveProvider: (channelId: string, optionId: string) => void
  pendingRemoval: PendingRemoval | null
  cancelRemoveProvider: () => void
  confirmRemoveProvider: () => void
  providerAddedAlertOpen: boolean
  dismissProviderAddedAlert: () => void
  providerRemovedAlertOpen: boolean
  dismissProviderRemovedAlert: () => void
}

const ProviderConfigurationContext =
  createContext<ProviderConfigurationContextValue | null>(null)

const ASSIGNMENTS_STORAGE_KEY = "integrations-provider-channel-assignments"

function buildInitialAssignments(): ChannelAssignments {
  const assignments: ChannelAssignments = {}

  for (const channel of PAYMENT_CHANNELS) {
    assignments[channel.id] = []
  }

  return assignments
}

function normalizeAssignments(stored: ChannelAssignments): ChannelAssignments {
  const assignments = buildInitialAssignments()
  const validChannelIds = new Set(PAYMENT_CHANNELS.map((channel) => channel.id))

  for (const [channelId, optionIds] of Object.entries(stored)) {
    if (!validChannelIds.has(channelId) || !Array.isArray(optionIds)) continue

    assignments[channelId] = optionIds
      .filter((optionId): optionId is string => typeof optionId === "string")
      .slice(0, MAX_PROVIDERS_PER_CHANNEL)
  }

  return assignments
}

function readStoredAssignments(): ChannelAssignments | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.sessionStorage.getItem(ASSIGNMENTS_STORAGE_KEY)
    if (!raw) return null

    return normalizeAssignments(JSON.parse(raw) as ChannelAssignments)
  } catch {
    return null
  }
}

function writeStoredAssignments(assignments: ChannelAssignments) {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(
      ASSIGNMENTS_STORAGE_KEY,
      JSON.stringify(assignments)
    )
  } catch {
    // Ignore quota / private-mode write failures in the prototype.
  }
}

export function ProviderConfigurationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [assignments, setAssignments] = useState<ChannelAssignments>(() =>
    buildInitialAssignments()
  )
  const [assignmentsHydrated, setAssignmentsHydrated] = useState(false)
  const [providerAddedAlertOpen, setProviderAddedAlertOpen] = useState(false)
  const [providerRemovedAlertOpen, setProviderRemovedAlertOpen] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(
    null
  )

  useEffect(() => {
    const stored = readStoredAssignments()
    if (stored) {
      setAssignments(stored)
    }
    setAssignmentsHydrated(true)
  }, [])

  useEffect(() => {
    if (!assignmentsHydrated) return
    writeStoredAssignments(assignments)
  }, [assignments, assignmentsHydrated])

  const getChannelProviders = useCallback(
    (channelId: string) => assignments[channelId] ?? [],
    [assignments]
  )

  const toggleProviderOption = useCallback(
    (channelId: string, optionId: string) => {
      let providerAdded = false

      setAssignments((prev) => {
        const current = prev[channelId] ?? []

        if (current.includes(optionId)) {
          return {
            ...prev,
            [channelId]: current.filter((id) => id !== optionId),
          }
        }

        if (current.length >= MAX_PROVIDERS_PER_CHANNEL) {
          return prev
        }

        providerAdded = current.length === MAX_PROVIDERS_PER_CHANNEL - 1

        return {
          ...prev,
          [channelId]: [...current, optionId],
        }
      })

      if (providerAdded) {
        setProviderAddedAlertOpen(true)
      }

      return providerAdded
    },
    []
  )

  const requestRemoveProvider = useCallback(
    (channelId: string, optionId: string) => {
      setPendingRemoval({ channelId, optionId })
    },
    []
  )

  const cancelRemoveProvider = useCallback(() => {
    setPendingRemoval(null)
  }, [])

  const confirmRemoveProvider = useCallback(() => {
    if (!pendingRemoval) return

    const { channelId, optionId } = pendingRemoval

    setAssignments((prev) => {
      const assigned = prev[channelId] ?? []
      if (!assigned.includes(optionId)) return prev

      return {
        ...prev,
        [channelId]: assigned.filter((id) => id !== optionId),
      }
    })

    setPendingRemoval(null)
    setProviderRemovedAlertOpen(true)
  }, [pendingRemoval])

  const dismissProviderAddedAlert = useCallback(() => {
    setProviderAddedAlertOpen(false)
  }, [])

  const dismissProviderRemovedAlert = useCallback(() => {
    setProviderRemovedAlertOpen(false)
  }, [])

  const value = useMemo<ProviderConfigurationContextValue>(
    () => ({
      assignments,
      getChannelProviders,
      toggleProviderOption,
      requestRemoveProvider,
      pendingRemoval,
      cancelRemoveProvider,
      confirmRemoveProvider,
      providerAddedAlertOpen,
      dismissProviderAddedAlert,
      providerRemovedAlertOpen,
      dismissProviderRemovedAlert,
    }),
    [
      assignments,
      getChannelProviders,
      toggleProviderOption,
      requestRemoveProvider,
      pendingRemoval,
      cancelRemoveProvider,
      confirmRemoveProvider,
      providerAddedAlertOpen,
      dismissProviderAddedAlert,
      providerRemovedAlertOpen,
      dismissProviderRemovedAlert,
    ]
  )

  return (
    <ProviderConfigurationContext.Provider value={value}>
      {children}
    </ProviderConfigurationContext.Provider>
  )
}

export function useProviderConfiguration(): ProviderConfigurationContextValue {
  const context = useContext(ProviderConfigurationContext)
  if (!context) {
    throw new Error(
      "useProviderConfiguration must be used inside ProviderConfigurationProvider"
    )
  }
  return context
}

export function getPaymentChannelById(channelId: string): PaymentChannel | undefined {
  return PAYMENT_CHANNELS.find((channel) => channel.id === channelId)
}

export { MAX_PROVIDERS_PER_CHANNEL }
