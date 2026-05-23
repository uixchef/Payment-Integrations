"use client"

import Image from "next/image"
import { Globe, Search, ToggleLeft } from "lucide-react"
import {
  ConfigurableFilterBar,
  pmcFilterIcon,
} from "@/components/integrations/integration-filter-bar"
import { ModeSwitcher } from "@/components/integrations/settings/integration-settings-fields"
import type { IntegrationEnvironment } from "@/components/integrations/settings/integration-settings-fields"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import {
  PMC_ADD_FILTER_OPTIONS,
  PMC_FILTER_DEFINITIONS,
  type PmcFilterType,
} from "@/lib/stripe-payment-method-filters"
import { cn } from "@/lib/utils"

type StripePaymentMethodsToolbarProps = {
  environment: IntegrationEnvironment
  onEnvironmentChange: (mode: IntegrationEnvironment) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  openFilterId: PmcFilterType | null
  openFilterAnchor: "toolbar" | "table" | null
  selections: Record<PmcFilterType, string[]>
  filterDraftIds: string[]
  visibleFilterTags: PmcFilterType[]
  onFilterDraftIdsChange: (ids: string[]) => void
  onFilterApply: (filterId: PmcFilterType, ids: string[]) => void
  onToolbarFilterOpenChange: (filterId: PmcFilterType, open: boolean) => void
  onAddFilter: (filterId: PmcFilterType) => void
  onRemoveFilter: (filterId: PmcFilterType) => void
}

export function StripePaymentMethodsToolbar({
  environment,
  onEnvironmentChange,
  searchQuery,
  onSearchChange,
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
}: StripePaymentMethodsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <ConfigurableFilterBar<PmcFilterType>
        filterDefinitions={PMC_FILTER_DEFINITIONS}
        addFilterOptions={PMC_ADD_FILTER_OPTIONS}
        openFilterId={openFilterId}
        openFilterAnchor={openFilterAnchor}
        selections={selections}
        filterDraftIds={filterDraftIds}
        visibleFilterTags={visibleFilterTags}
        onFilterDraftIdsChange={onFilterDraftIdsChange}
        onFilterApply={onFilterApply}
        onToolbarFilterOpenChange={onToolbarFilterOpenChange}
        onAddFilter={onAddFilter}
        onRemoveFilter={onRemoveFilter}
        nonRemovableFilterIds={["product-area"]}
        renderFilterIcon={pmcFilterIcon}
      />

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <ModeSwitcher value={environment} onChange={onEnvironmentChange} />
        <label className="relative w-full max-w-[280px]">
          <span className="sr-only">Search payment methods</span>
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-[#667085]"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search payment methods"
            className={cn(
              "h-9 w-full rounded border border-[#d0d5dd] bg-white py-0 pl-8 pr-2",
              "font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828]",
              "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#475467]",
              "focus-visible:border-[#84adff] focus-visible:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
            )}
          />
        </label>
      </div>
    </div>
  )
}

export function FilterLinesIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={INTEGRATION_ASSETS.table.filterLines}
      alt=""
      width={14}
      height={14}
      className={cn("size-3.5 shrink-0", className)}
      aria-hidden
      draggable={false}
    />
  )
}

export function TableHeaderIcon({
  variant,
}: {
  variant: "payment-methods" | "type" | "popular-in" | "enable"
}) {
  if (variant === "payment-methods") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={INTEGRATION_ASSETS.table.creditCard}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        aria-hidden
        draggable={false}
      />
    )
  }

  if (variant === "type") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={INTEGRATION_ASSETS.table.sell}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        aria-hidden
        draggable={false}
      />
    )
  }

  if (variant === "popular-in") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={INTEGRATION_ASSETS.table.public}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        aria-hidden
        draggable={false}
      />
    )
  }

  return (
    <ToggleLeft className="size-4 shrink-0 text-[#475467]" strokeWidth={1.75} />
  )
}

export function RegionEarthIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={INTEGRATION_ASSETS.icons.earth}
      alt=""
      width={16}
      height={16}
      className="size-4 shrink-0"
      aria-hidden
      draggable={false}
    />
  )
}

export function RegionPublicIcon() {
  return (
    <Globe className="size-4 shrink-0 text-[#475467]" strokeWidth={1.75} aria-hidden />
  )
}

export function PaymentMethodIcon({ src, name }: { src: string; name: string }) {
  const isSvg = src.endsWith(".svg")
  const isBrandWordmark =
    src.includes("amazon-pay") || src.includes("apple-pay")

  return (
    <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={24}
          height={24}
          className={cn(
            "object-contain",
            isBrandWordmark ? "h-6 w-full max-w-6" : "size-6"
          )}
          aria-hidden
          draggable={false}
        />
      ) : (
        <Image
          src={src}
          alt=""
          width={24}
          height={24}
          unoptimized
          className="size-full object-contain"
          aria-hidden
        />
      )}
      <span className="sr-only">{name}</span>
    </span>
  )
}
