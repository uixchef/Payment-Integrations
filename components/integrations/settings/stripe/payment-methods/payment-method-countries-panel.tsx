"use client"

import Image from "next/image"
import { CountriesListPanel } from "@/components/integrations/countries-list-panel"
import { countriesFromCodes } from "@/lib/integration-countries"
import type { PaymentMethodTableRow } from "@/lib/stripe-payment-methods-data"
import { getPopularInCountryCodes } from "@/lib/stripe-payment-method-countries"

function PanelHeader({ row }: { row: PaymentMethodTableRow }) {
  const isSvg = row.icon.endsWith(".svg")

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.icon}
            alt=""
            className="size-4 object-contain"
            aria-hidden
            draggable={false}
          />
        ) : (
          <Image
            src={row.icon}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-full object-contain"
            aria-hidden
          />
        )}
      </div>
      <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-[15px] font-semibold leading-5 text-[#101828]">
        {row.name} popular countries
      </p>
    </div>
  )
}

type PaymentMethodCountriesPanelProps = {
  row: PaymentMethodTableRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentMethodCountriesPanel({
  row,
  open,
  onOpenChange,
}: PaymentMethodCountriesPanelProps) {
  if (!row) {
    return null
  }

  const countries = countriesFromCodes(getPopularInCountryCodes(row.popularIn))

  return (
    <CountriesListPanel
      open={open}
      onOpenChange={onOpenChange}
      sheetTitle={`${row.name} popular countries`}
      header={<PanelHeader row={row} />}
      countries={countries}
      searchAriaLabel={`Search ${row.name} countries`}
    />
  )
}
