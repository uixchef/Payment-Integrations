"use client"

import { AddProviderPopover } from "@/components/integrations/configure/add-provider-popover"
import { ProviderTag } from "@/components/integrations/configure/provider-tag"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import {
  MAX_PROVIDERS_PER_CHANNEL,
  useProviderConfiguration,
} from "@/lib/provider-configuration-context"
import type { PaymentChannel } from "@/lib/provider-configuration-data"
import { cn } from "@/lib/utils"

const TABLE_ICONS = INTEGRATION_ASSETS.table

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

function NameColumnHeader() {
  return (
    <div className="flex h-9 items-center border-b border-r border-[#d0d5dd] bg-[#f2f4f7] px-3">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <TableHeaderIcon src={TABLE_ICONS.slabSerif} className="size-4" />
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          Name
        </span>
        <TableHeaderIcon src={TABLE_ICONS.filterLines} className="size-3.5" />
      </div>
    </div>
  )
}

function ProviderColumnHeader() {
  return (
    <div className="flex h-9 items-center border-b border-[#d0d5dd] bg-[#f2f4f7] px-3">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <TableHeaderIcon src={TABLE_ICONS.creditCard} className="size-4" />
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          Payment provider
        </span>
        <TableHeaderIcon src={TABLE_ICONS.filterLines} className="size-3.5" />
      </div>
    </div>
  )
}

function ProviderCell({
  channelId,
  hasConnectedProviders,
}: {
  channelId: string
  hasConnectedProviders: boolean
}) {
  const {
    getChannelProviders,
    toggleProviderOption,
    requestRemoveProvider,
  } = useProviderConfiguration()

  const assignedProviders = getChannelProviders(channelId)
  const canAddProvider = assignedProviders.length < MAX_PROVIDERS_PER_CHANNEL

  const addButton = canAddProvider ? (
    <AddProviderPopover
      assignedOptionIds={assignedProviders}
      disabled={!hasConnectedProviders}
      onToggle={(optionId) => toggleProviderOption(channelId, optionId)}
    />
  ) : null

  return (
    <div className="flex h-9 items-center gap-1 border-b border-[#d0d5dd] px-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {assignedProviders.map((providerId) => (
          <ProviderTag
            key={providerId}
            providerId={providerId}
            onRemove={() => requestRemoveProvider(channelId, providerId)}
          />
        ))}
        {addButton}
      </div>
    </div>
  )
}

export function ProviderConfigurationTable({
  channels,
  hasConnectedProviders,
}: {
  channels: PaymentChannel[]
  hasConnectedProviders: boolean
}) {
  return (
    <div className="overflow-x-auto rounded border border-[#d0d5dd] bg-white">
      <div className="grid min-w-[640px] grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <NameColumnHeader />
        <ProviderColumnHeader />

        {channels.map((channel) => (
          <div key={channel.id} className="contents">
            <div className="flex h-9 items-center border-b border-[#d0d5dd] px-3">
              <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
                {channel.name}
              </span>
            </div>
            <ProviderCell
              channelId={channel.id}
              hasConnectedProviders={hasConnectedProviders}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
