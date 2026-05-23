"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { IntegrationEnvironment } from "@/components/integrations/settings/integration-settings-fields"
import { useFilterBarState } from "@/hooks/use-filter-bar-state"
import { filterStripePaymentMethods } from "@/lib/filter-stripe-payment-methods"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import {
  PMC_DEFAULT_FILTER_SELECTIONS,
  PMC_EMPTY_FILTER_SELECTIONS,
  PMC_FILTER_TYPES,
} from "@/lib/stripe-payment-method-filters"
import {
  STRIPE_PAYMENT_METHODS,
  countEnabledPaymentMethods,
  initialPaymentMethodEnabledState,
  type StripePaymentMethodRow,
} from "@/lib/stripe-payment-methods-data"
import { cn } from "@/lib/utils"
import { PaymentMethodCountriesPanel } from "./payment-method-countries-panel"
import { StripePaymentMethodsTable } from "./stripe-payment-methods-table"
import { StripePaymentMethodsToolbar } from "./stripe-payment-methods-toolbar"

export function StripePaymentMethodsShell({ item }: { item: IntegrationItem }) {
  const logo = item.logo ?? INTEGRATION_ASSETS.logos.stripe
  const [environment, setEnvironment] = useState<IntegrationEnvironment>("live")
  const [searchQuery, setSearchQuery] = useState("")
  const [enabledById, setEnabledById] = useState(initialPaymentMethodEnabledState)
  const [countriesPanelRow, setCountriesPanelRow] =
    useState<StripePaymentMethodRow | null>(null)
  const [countriesPanelOpen, setCountriesPanelOpen] = useState(false)

  const {
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
  } = useFilterBarState(PMC_FILTER_TYPES, PMC_EMPTY_FILTER_SELECTIONS, {
    initialSelections: PMC_DEFAULT_FILTER_SELECTIONS,
    initialPinned: ["product-area"],
  })

  const activeCount = countEnabledPaymentMethods(enabledById)

  const filteredRows = useMemo(() => {
    const byFilters = filterStripePaymentMethods(STRIPE_PAYMENT_METHODS, selections)
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) return byFilters
    return byFilters.filter((row) => row.name.toLowerCase().includes(normalized))
  }, [searchQuery, selections])

  const handleViewAllCountries = (row: StripePaymentMethodRow) => {
    setCountriesPanelRow(row)
    setCountriesPanelOpen(true)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-[62px] shrink-0 items-center border-b border-[#d0d5dd] bg-white px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/integrations/stripe"
            aria-label="Back to Stripe integration settings"
            className="flex size-6 shrink-0 items-center justify-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          >
            <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
          </Link>

          <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={logo}
              alt=""
              width={44}
              height={44}
              unoptimized
              className="size-11 object-contain"
              aria-hidden
            />
          </span>

          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
                Stripe payment method configuration
              </h1>
              <span
                className={cn(
                  "inline-flex h-6 shrink-0 items-center rounded-xl px-2",
                  "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
                  "bg-[#ecfdf3] text-[#027a48]"
                )}
              >
                {activeCount} active
              </span>
            </div>
            <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
              Turn on the payment methods you want to offer your customers.
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4">
            <StripePaymentMethodsToolbar
              environment={environment}
              onEnvironmentChange={setEnvironment}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
            <StripePaymentMethodsTable
              rows={filteredRows}
              enabledById={enabledById}
              onEnabledChange={(id, next) =>
                setEnabledById((prev) => ({ ...prev, [id]: next }))
              }
              onViewAllCountries={handleViewAllCountries}
              openFilterId={openFilterId}
              openFilterAnchor={openFilterAnchor}
              selections={selections}
              filterDraftIds={filterDraftIds}
              onFilterOpenChange={handleTableFilterOpenChange}
              onFilterDraftIdsChange={setFilterDraftIds}
              onFilterApply={handleFilterApply}
            />
          </div>
        </div>
      </div>

      <PaymentMethodCountriesPanel
        row={countriesPanelRow}
        open={countriesPanelOpen}
        onOpenChange={setCountriesPanelOpen}
      />
    </div>
  )
}
