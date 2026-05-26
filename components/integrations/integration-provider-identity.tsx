import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"

export function IntegrationProviderIdentity({
  item,
  nameClassName = "truncate text-base font-medium leading-6 text-[#475467]",
  isDefault = false,
  alignBadgesEnd = false,
}: {
  item: IntegrationItem
  nameClassName?: string
  isDefault?: boolean
  /** Table: badges sit inline with the name. Cards/grid: badges align to the far edge. */
  alignBadgesEnd?: boolean
}) {
  const logoSrc =
    item.logo ??
    (item.usePlaceholder ? INTEGRATION_ASSETS.logos.placeholder : undefined)

  const defaultBadge = isDefault ? (
    <span
      className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-xl bg-[#eff4ff] px-2 py-0.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#004eeb]"
      aria-label="Default payment provider"
    >
      Default
    </span>
  ) : null

  const verifiedBadge = item.verified ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Built by LeadConnector"
          className="inline-flex w-fit shrink-0 cursor-default items-center rounded-full bg-[#f0f9ff] px-2 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#84adff]"
        >
          <Image
            src={INTEGRATION_ASSETS.icons.verified}
            alt=""
            width={16}
            height={16}
            unoptimized
            className="size-4"
            aria-hidden
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        Built by LeadConnector
      </TooltipContent>
    </Tooltip>
  ) : null

  const badges =
    defaultBadge || verifiedBadge ? (
      <div className="flex shrink-0 items-center gap-2">
        {defaultBadge}
        {verifiedBadge}
      </div>
    ) : null

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        alignBadgesEnd && "w-full"
      )}
    >
      <div className="relative size-8 shrink-0 overflow-hidden rounded">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt=""
            fill
            unoptimized
            className={cn(
              item.id === "mercado-pago" ? "object-cover" : "object-contain"
            )}
            sizes="32px"
            aria-hidden
          />
        ) : (
          <Image
            src={INTEGRATION_ASSETS.logos.placeholder}
            alt=""
            fill
            unoptimized
            className="object-contain opacity-70"
            sizes="32px"
            aria-hidden
          />
        )}
      </div>
      {alignBadgesEnd ? (
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className={cn(nameClassName, "min-w-0")}>{item.name}</span>
          {badges}
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-2">
          <span className={nameClassName}>{item.name}</span>
          {badges}
        </div>
      )}
    </div>
  )
}
