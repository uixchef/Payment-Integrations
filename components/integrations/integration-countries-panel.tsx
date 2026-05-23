"use client"

import Image from "next/image"
import { CountriesListPanel } from "@/components/integrations/countries-list-panel"
import {
  countriesFromCodes,
  getIntegrationCountries,
} from "@/lib/integration-countries"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"

function PanelHeader({ item }: { item: IntegrationItem }) {
  const logo =
    item.logo ??
    (item.usePlaceholder
      ? INTEGRATION_ASSETS.logos.placeholder
      : INTEGRATION_ASSETS.logos.placeholder)

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div className="relative size-6 shrink-0 overflow-hidden rounded">
        <Image
          src={logo}
          alt=""
          width={24}
          height={24}
          unoptimized
          className="size-full object-cover"
          aria-hidden
        />
      </div>
      <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-[15px] font-semibold leading-5 text-[#101828]">
        {item.name} merchant countries
      </p>
    </div>
  )
}

type IntegrationCountriesPanelProps = {
  item: IntegrationItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IntegrationCountriesPanel({
  item,
  open,
  onOpenChange,
}: IntegrationCountriesPanelProps) {
  if (!item) {
    return null
  }

  return (
    <CountriesListPanel
      open={open}
      onOpenChange={onOpenChange}
      sheetTitle={`${item.name} merchant countries`}
      header={<PanelHeader item={item} />}
      countries={getIntegrationCountries(item.id)}
    />
  )
}
