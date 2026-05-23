"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  chunkCountryTooltipRows,
  DEFAULT_EXTRA_COUNTRY_TOOLTIP,
  getCountryLabel,
  type CountryTooltipSegment,
} from "@/lib/country-labels"
import { getIntegrationCountries } from "@/lib/integration-countries"
import { flagAsset } from "@/lib/integration-assets"
import { cn } from "@/lib/utils"

const tagLabelClassName =
  "whitespace-nowrap font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054]"

const tagShellClassName =
  "inline-flex h-7 max-h-7 min-h-7 shrink-0 items-center justify-center gap-0.5 rounded bg-[#f2f4f7] px-2"

/** Extra countries that fit in the tooltip without a side-panel CTA. */
export const VIEW_ALL_CTA_THRESHOLD = 2

/** Max countries previewed in the +N tooltip before "Click to view all". */
export const TOOLTIP_PREVIEW_COUNT = 10

function CountryTag({ code }: { code: string }) {
  return (
    <span className={tagShellClassName}>
      <Image
        src={flagAsset(code)}
        alt=""
        width={16}
        height={16}
        unoptimized
        className="size-4 shrink-0 rounded-full object-cover"
        aria-hidden
      />
      <span className={tagLabelClassName}>{getCountryLabel(code)}</span>
    </span>
  )
}

function ViewAllTag({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
      className={cn(
        tagShellClassName,
        "cursor-pointer outline-none hover:bg-[#eaecf0] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      )}
      data-view-all-countries
    >
      <Eye className="size-4 shrink-0 text-[#344054]" strokeWidth={2} aria-hidden />
      <span className={tagLabelClassName}>Click to view all</span>
    </button>
  )
}

function TooltipTagRow({
  segments,
  showViewAll,
  onViewAll,
}: {
  segments: CountryTooltipSegment[]
  showViewAll?: boolean
  onViewAll?: () => void
}) {
  return (
    <div className="flex w-fit flex-wrap items-center gap-1">
      {segments.map((segment, index) => {
        if (typeof segment === "string") {
          return <CountryTag key={segment} code={segment} />
        }

        return (
          <div key={`group-${index}`} className="flex items-center gap-0.5">
            {segment.map((code) => (
              <CountryTag key={code} code={code} />
            ))}
          </div>
        )
      })}
      {showViewAll && onViewAll ? <ViewAllTag onClick={onViewAll} /> : null}
    </div>
  )
}

function CountryTooltipContent({
  layout,
  showViewAll,
  onViewAll,
}: {
  layout: CountryTooltipSegment[][]
  showViewAll: boolean
  onViewAll?: () => void
}) {
  return (
    <div className="flex w-fit flex-col gap-1">
      {layout.map((row, index) => (
        <TooltipTagRow
          key={`row-${index}`}
          segments={row}
          showViewAll={showViewAll && index === layout.length - 1}
          onViewAll={onViewAll}
        />
      ))}
    </div>
  )
}

function getTooltipCountryCodes({
  integrationId,
  visibleFlags,
  tooltipFlags,
}: {
  integrationId?: string
  visibleFlags?: string[]
  tooltipFlags?: string[]
}): string[] {
  const visible = new Set(visibleFlags ?? [])

  if (integrationId) {
    const providerCodes = getIntegrationCountries(integrationId).map(
      (country) => country.code
    )
    const hidden = providerCodes.filter((code) => !visible.has(code))
    if (hidden.length > 0) {
      return hidden
    }
  }

  if (tooltipFlags && tooltipFlags.length > 0) {
    const hidden = tooltipFlags.filter((code) => !visible.has(code))
    if (hidden.length > 0) {
      return hidden
    }
    return tooltipFlags
  }

  return DEFAULT_EXTRA_COUNTRY_TOOLTIP.filter((code) => !visible.has(code))
}

function buildTooltipLayout(codes: string[]): CountryTooltipSegment[][] {
  return chunkCountryTooltipRows(codes).map((row) => [...row])
}

export function ExtraCountBadge({
  count,
  integrationId,
  visibleFlags,
  tooltipFlags,
  index,
  onViewAll,
}: {
  count: number
  integrationId?: string
  visibleFlags?: string[]
  tooltipFlags?: string[]
  index: number
  onViewAll?: () => void
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const allCodes = getTooltipCountryCodes({
    integrationId,
    visibleFlags,
    tooltipFlags,
  })
  const showViewAllCta =
    Boolean(onViewAll) &&
    (count > VIEW_ALL_CTA_THRESHOLD || allCodes.length > TOOLTIP_PREVIEW_COUNT)
  const previewCount = showViewAllCta
    ? TOOLTIP_PREVIEW_COUNT
    : Math.min(allCodes.length, TOOLTIP_PREVIEW_COUNT)
  const previewCodes = allCodes.slice(0, previewCount)
  const layout = buildTooltipLayout(previewCodes)

  const handleViewAll = () => {
    setTooltipOpen(false)
    onViewAll?.()
  }

  return (
    <Tooltip
      delayDuration={200}
      open={tooltipOpen}
      onOpenChange={setTooltipOpen}
    >
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${count} more countries. Hover to preview.`}
          className={cn(
            "relative flex h-6 shrink-0 cursor-default items-center justify-center rounded-full bg-[#f2f4f7] px-1.5",
            "font-[family-name:var(--font-inter)] text-xs font-medium leading-[17px] text-[#475467]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
          style={{ zIndex: index + 1 }}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-solid border-[var(--card-surface-color,white)] transition-colors"
            aria-hidden
          />
          +{count}
        </button>
      </TooltipTrigger>
      <TooltipContent
        fitContent
        side="bottom"
        align="start"
        sideOffset={6}
        className={cn(
          "rounded border-0 p-2 text-left",
          "shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        )}
        onPointerDownOutside={(event) => {
          const target = event.target
          if (
            target instanceof Element &&
            target.closest("[data-view-all-countries]")
          ) {
            event.preventDefault()
          }
        }}
      >
        <CountryTooltipContent
          layout={layout}
          showViewAll={showViewAllCta}
          onViewAll={showViewAllCta ? handleViewAll : undefined}
        />
      </TooltipContent>
    </Tooltip>
  )
}
