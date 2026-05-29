"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"

function DefaultHeaderBadge() {
  return (
    <span className="inline-flex h-[18px] shrink-0 items-center justify-center rounded bg-[#eff4ff] px-1.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#004eeb]">
      Default
    </span>
  )
}

export function IntegrationSettingsSubHeader({
  item,
  isDefault = false,
}: {
  item: IntegrationItem
  isDefault?: boolean
}) {
  const logo = item.logo ?? INTEGRATION_ASSETS.logos.placeholder

  return (
    <header className="flex h-[62px] shrink-0 items-center gap-3 border-b border-[#d0d5dd] bg-white px-4">
      <Link
        href="/integrations"
        aria-label="Back to integrations"
        className="flex size-6 shrink-0 items-center justify-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
      </Link>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
          <Image
            src={logo}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-6 object-contain"
            aria-hidden
          />
        </span>
        <h1 className="truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {item.name} integration settings
        </h1>
        {isDefault ? <DefaultHeaderBadge /> : null}
      </div>
    </header>
  )
}
