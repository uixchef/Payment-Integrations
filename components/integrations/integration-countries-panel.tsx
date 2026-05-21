"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import {
  Sheet,
  SheetBody,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { getCountryLabel } from "@/lib/country-labels"
import {
  filterIntegrationCountries,
  getIntegrationCountries,
} from "@/lib/integration-countries"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"

const TABLE_COLUMNS = "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
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

function PanelHeader({ item }: { item: IntegrationItem }) {
  const logo =
    item.logo ??
    (item.usePlaceholder
      ? INTEGRATION_ASSETS.logos.placeholder
      : INTEGRATION_ASSETS.logos.placeholder)

  return (
    <SheetHeader>
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
      <SheetCloseButton />
    </SheetHeader>
  )
}

function CountriesTableHeaderCell({
  label,
  last = false,
}: {
  label: string
  last?: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center border-b border-[#d0d5dd] bg-[#f2f4f7] px-3",
        !last && "border-r"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {label}
        </span>
        <TableHeaderIcon src={TABLE_ICONS.filterLines} className="size-3.5" />
      </div>
    </div>
  )
}

function CountriesTableRow({
  continent,
  country,
}: {
  continent: string
  country: string
}) {
  return (
    <div
      className={cn(
        TABLE_COLUMNS,
        "group transition-colors hover:bg-[#f5f8ff]"
      )}
    >
      <div className="flex h-9 items-center border-b border-r border-[#d0d5dd] px-3">
        <p className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {continent}
        </p>
      </div>
      <div className="flex h-9 items-center border-b border-[#d0d5dd] px-3">
        <p className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          {country}
        </p>
      </div>
    </div>
  )
}

function CountriesTable({
  integrationId,
  searchQuery,
}: {
  integrationId: string
  searchQuery: string
}) {
  const rows = useMemo(() => {
    const countries = getIntegrationCountries(integrationId)
    return filterIntegrationCountries(countries, searchQuery)
  }, [integrationId, searchQuery])

  return (
    <div className="grid min-h-0 flex-1 max-h-full w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded border border-[#d0d5dd] bg-white">
      <div className="overflow-x-auto">
        <div className={TABLE_COLUMNS} role="row">
          <CountriesTableHeaderCell label="Continent" />
          <CountriesTableHeaderCell label="Country" last />
        </div>
      </div>

      <div className="min-h-0 overflow-x-auto overflow-y-auto overscroll-y-contain">
        {rows.length === 0 ? (
          <div className="flex items-center justify-center px-4 py-8">
            <p className="text-center font-[family-name:var(--font-inter)] text-base leading-6 text-[#667085]">
              No countries match your search.
            </p>
          </div>
        ) : (
          <div role="rowgroup">
            {rows.map(({ continent, code }) => (
              <CountriesTableRow
                key={`${continent}-${code}`}
                continent={continent}
                country={getCountryLabel(code)}
              />
            ))}
          </div>
        )}
      </div>
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
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSearchQuery("")
    }
    onOpenChange(nextOpen)
  }

  if (!item) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle>{item.name} merchant countries</SheetTitle>
        <PanelHeader item={item} />
        <SheetBody>
          <div className="relative shrink-0">
            <Search
              className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-[#667085]"
              strokeWidth={1.75}
              aria-hidden
            />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="h-9 pl-8 text-base placeholder:text-[#667085]"
              aria-label="Search countries"
            />
          </div>
          <CountriesTable
            integrationId={item.id}
            searchQuery={searchQuery}
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
