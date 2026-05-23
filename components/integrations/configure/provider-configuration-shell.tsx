"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Search,
} from "lucide-react"
import { ProviderAddedAlert } from "@/components/integrations/configure/provider-added-alert"
import { ProviderConfigurationTable } from "@/components/integrations/configure/provider-configuration-table"
import { ProviderRemovedAlert } from "@/components/integrations/configure/provider-removed-alert"
import { RemoveProviderDialog } from "@/components/integrations/configure/remove-provider-dialog"
import { ModeSwitcher } from "@/components/integrations/settings/integration-settings-fields"
import type { IntegrationEnvironment } from "@/components/integrations/settings/integration-settings-fields"
import { INTEGRATIONS } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  useProviderConfiguration,
} from "@/lib/provider-configuration-context"
import { PAYMENT_CHANNELS } from "@/lib/provider-configuration-data"

function ConfigurationSubHeader() {
  return (
    <header className="flex min-h-[62px] shrink-0 flex-col justify-center border-b border-[#d0d5dd] bg-white px-4 py-1">
      <div className="flex items-center gap-3">
        <Link
          href="/integrations"
          aria-label="Back to integrations"
          className="flex size-6 shrink-0 items-center justify-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
        >
          <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
        </Link>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Manage provider configuration
          </h1>
          <p className="truncate font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
            Choose a default provider per channel. PayPal can be paired with
            another provider or disabled per workflow.
          </p>
        </div>
      </div>
    </header>
  )
}

function ProviderConfigurationContent({
  filteredChannels,
  hasConnectedProviders,
  mode,
  onModeChange,
  searchQuery,
  onSearchQueryChange,
}: {
  filteredChannels: typeof PAYMENT_CHANNELS
  hasConnectedProviders: boolean
  mode: IntegrationEnvironment
  onModeChange: (mode: IntegrationEnvironment) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}) {
  const {
    providerAddedAlertOpen,
    dismissProviderAddedAlert,
    providerRemovedAlertOpen,
    dismissProviderRemovedAlert,
  } = useProviderConfiguration()

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {providerAddedAlertOpen ? (
        <ProviderAddedAlert
          open={providerAddedAlertOpen}
          onDismiss={dismissProviderAddedAlert}
          className="absolute left-1/2 top-3 z-20 -translate-x-1/2"
        />
      ) : null}
      {providerRemovedAlertOpen ? (
        <ProviderRemovedAlert
          open={providerRemovedAlertOpen}
          onDismiss={dismissProviderRemovedAlert}
          className="absolute left-1/2 top-3 z-20 -translate-x-1/2"
        />
      ) : null}

      <ConfigurationSubHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-[12px] bg-white p-4 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-7 items-center gap-0.5 rounded-full border border-[#d0d5dd] bg-white pl-2 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054] outline-none hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
              >
                <Plus className="size-[18px]" strokeWidth={1.75} aria-hidden />
                Add filter
              </button>
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <ModeSwitcher value={mode} onChange={onModeChange} />
              <label className="relative w-full max-w-[280px]">
                <span className="sr-only">Search payment channels</span>
                <Search
                  className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#475467]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => onSearchQueryChange(event.target.value)}
                  placeholder="Search payment channels"
                  className="h-9 w-full rounded border border-[#d0d5dd] bg-white py-0 pl-8 pr-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#475467] focus-visible:border-[#84adff] focus-visible:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
                />
              </label>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <ProviderConfigurationTable
              channels={filteredChannels}
              hasConnectedProviders={hasConnectedProviders}
            />
          </div>
        </div>
      </div>

      <RemoveProviderDialog />
    </div>
  )
}

export function ProviderConfigurationShell() {
  const { isConnected } = useIntegrationStatus()
  const [mode, setMode] = useState<IntegrationEnvironment>("live")
  const [searchQuery, setSearchQuery] = useState("")

  const hasConnectedProviders = INTEGRATIONS.some((item) =>
    isConnected(item.id)
  )

  const filteredChannels = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return PAYMENT_CHANNELS

    return PAYMENT_CHANNELS.filter((channel) =>
      channel.name.toLowerCase().includes(normalized)
    )
  }, [searchQuery])

  return (
    <ProviderConfigurationContent
      filteredChannels={filteredChannels}
      hasConnectedProviders={hasConnectedProviders}
      mode={mode}
      onModeChange={setMode}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
