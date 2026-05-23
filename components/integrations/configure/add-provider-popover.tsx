"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Check, Plus, Search } from "lucide-react"
import { DisabledAddProviderButton } from "@/components/integrations/configure/no-provider-connected-tooltip"
import { usePayPalAccounts } from "@/components/integrations/settings/paypal/paypal-accounts-context"
import { useStripeAccounts } from "@/components/integrations/settings/stripe/stripe-accounts-context"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  applyProviderOptionDisabledState,
  buildProviderConfigOptions,
  type ProviderConfigOption,
} from "@/lib/provider-configuration-options"
import { MAX_PROVIDERS_PER_CHANNEL } from "@/lib/provider-configuration-data"
import { cn } from "@/lib/utils"

function ProviderDropdownItem({
  option,
  selected,
  onToggle,
}: {
  option: ProviderConfigOption
  selected: boolean
  onToggle: () => void
}) {
  const isDisabled = Boolean(option.disabled)
  const isAccountRow = Boolean(option.subtitle)

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 text-left outline-none",
        selected && !isDisabled && "bg-[#eff4ff]",
        !selected && !isDisabled && "hover:bg-[#f2f4f7] focus-visible:bg-[#f2f4f7]",
        isDisabled && "cursor-not-allowed bg-[#f9fafb]"
      )}
    >
      <span
        className={cn(
          "flex min-w-0 flex-1 items-start gap-1",
          isAccountRow && "items-start"
        )}
      >
        <span
          className={cn(
            "relative mt-1 size-4 shrink-0 overflow-hidden",
            !isAccountRow && "mt-0.5",
            isDisabled && "opacity-50"
          )}
        >
          <Image
            src={option.logo}
            alt=""
            width={16}
            height={16}
            unoptimized
            className="size-4 object-contain"
            aria-hidden
          />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6",
              isDisabled ? "text-[#98a2b3]" : "text-[#101828]"
            )}
          >
            {option.label}
          </span>
          {option.subtitle ? (
            <span
              className={cn(
                "block truncate font-[family-name:var(--font-inter)] text-sm leading-5",
                isDisabled ? "text-[#98a2b3]" : "text-[#475467]"
              )}
            >
              {option.subtitle}
            </span>
          ) : null}
        </span>
      </span>
      {selected && !isDisabled ? (
        <Check
          className="size-4 shrink-0 text-[#004eeb]"
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
    </button>
  )
}

export function AddProviderPopover({
  assignedOptionIds,
  onToggle,
  disabled = false,
}: {
  assignedOptionIds: string[]
  onToggle: (optionId: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { isConnected } = useIntegrationStatus()
  const { accounts: paypalAccounts } = usePayPalAccounts()
  const { accounts: stripeAccounts } = useStripeAccounts()
  const atProviderLimit = assignedOptionIds.length >= MAX_PROVIDERS_PER_CHANNEL

  const options = useMemo(() => {
    const baseOptions = buildProviderConfigOptions({
      isConnected,
      paypalAccounts: paypalAccounts.map((account) => ({
        id: account.id,
        label: account.label,
        connected: account.connected,
      })),
      stripeAccounts: stripeAccounts.map((account) => ({
        id: account.id,
        label: account.label,
        connected: account.connected,
      })),
    })

    return applyProviderOptionDisabledState(baseOptions, assignedOptionIds).map(
      (option) => {
        if (
          atProviderLimit &&
          !assignedOptionIds.includes(option.id) &&
          !option.disabled
        ) {
          return { ...option, disabled: true }
        }

        return option
      }
    )
  }, [assignedOptionIds, atProviderLimit, isConnected, paypalAccounts, stripeAccounts])

  const filteredOptions = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return options

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) ||
        option.subtitle?.toLowerCase().includes(normalized)
    )
  }, [options, searchQuery])

  const button = (
    <button
      type="button"
      disabled={disabled}
      aria-label="Add payment provider"
      aria-expanded={open}
      className={cn(
        "inline-flex size-6 items-center justify-center rounded border border-[#d0d5dd] bg-white outline-none",
        disabled
          ? "cursor-not-allowed text-[#98a2b3]"
          : "text-[#475467] hover:border-[#98a2b3] hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      )}
    >
      <Plus className="size-4" strokeWidth={1.75} aria-hidden />
    </button>
  )

  if (disabled) {
    return <DisabledAddProviderButton />
  }

  if (options.length === 0) {
    return button
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSearchQuery("")
        }
      }}
    >
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[240px] overflow-hidden rounded border border-[#d0d5dd] bg-white p-0 pb-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex h-[52px] items-center p-2">
          <label className="relative flex h-9 w-full items-center">
            <span className="sr-only">Search providers</span>
            <Search
              className="pointer-events-none absolute left-2 size-4 text-[#667085]"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded border border-[#d0d5dd] bg-white py-0 pl-8 pr-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#667085] focus-visible:border-[#84adff] focus-visible:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
            />
          </label>
        </div>

        <div className="max-h-[364px] overflow-y-auto overscroll-contain">
          {filteredOptions.map((option) => (
            <ProviderDropdownItem
              key={option.id}
              option={option}
              selected={assignedOptionIds.includes(option.id)}
              onToggle={() => {
                if (option.disabled) return
                const isRemoving = assignedOptionIds.includes(option.id)
                if (!isRemoving && atProviderLimit) return
                onToggle(option.id)
                if (!isRemoving) {
                  setOpen(false)
                  setSearchQuery("")
                }
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
