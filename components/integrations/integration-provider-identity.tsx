import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"

export function IntegrationProviderIdentity({
  item,
  nameClassName = "truncate text-base font-medium leading-6 text-[#475467]",
  isDefault = false,
}: {
  item: IntegrationItem
  nameClassName?: string
  isDefault?: boolean
}) {
  const logoSrc =
    item.logo ??
    (item.usePlaceholder ? INTEGRATION_ASSETS.logos.placeholder : undefined)

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="relative size-8 shrink-0 overflow-hidden rounded">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt=""
            width={32}
            height={32}
            unoptimized
            className="size-8 object-contain"
            aria-hidden
          />
        ) : (
          <Image
            src={INTEGRATION_ASSETS.logos.placeholder}
            alt=""
            width={32}
            height={32}
            unoptimized
            className="size-8 object-contain opacity-70"
            aria-hidden
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className={nameClassName}>{item.name}</span>
        {isDefault ? (
          <span
            className="inline-flex h-6 shrink-0 items-center rounded-xl bg-[#eff4ff] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#004eeb]"
            aria-label="Default payment provider"
          >
            Default
          </span>
        ) : null}
        {item.verified ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Built by LeadConnector"
                className="flex h-6 shrink-0 cursor-default items-center rounded-full bg-[#f0f9ff] px-2 outline-none focus-visible:ring-2 focus-visible:ring-[#84adff]"
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
        ) : null}
      </div>
    </div>
  )
}
