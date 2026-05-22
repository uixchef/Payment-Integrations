"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type StripeSyncCardProps = {
  enabled: boolean
  onSync?: () => void
}

export function StripeSyncCard({ enabled, onSync }: StripeSyncCardProps) {
  const syncButton = (
    <button
      type="button"
      aria-disabled={!enabled}
      onClick={() => {
        if (!enabled) return
        onSync?.()
      }}
      className={cn(
        "inline-flex h-9 w-full items-center justify-center gap-2 rounded border bg-white px-3.5 py-2",
        "font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
        "outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[#84adff]",
        enabled
          ? "cursor-pointer border-[#84adff] text-[#004eeb] shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#f5f8ff]"
          : "cursor-not-allowed border-[#b2ccff] text-[#b2ccff] shadow-none"
      )}
    >
      Start Stripe sync
      <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
    </button>
  )

  return (
    <aside
      aria-label="Sync your existing Stripe data"
      className="flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#d1e0ff]">
          <Image
            src="/integrations/stripe/refresh-ccw-03.png"
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-6"
            aria-hidden
          />
        </span>
        <h2 className="flex-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          Sync your existing Stripe data
        </h2>
      </div>

      <p className="font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
        HighLevel imports saved payment references already stored in Stripe. No
        card re-entry required for your customers.
      </p>

      {enabled ? (
        syncButton
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>{syncButton}</TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="max-w-[260px]">
            Connect a Stripe account to sync your existing payment data.
          </TooltipContent>
        </Tooltip>
      )}
    </aside>
  )
}
