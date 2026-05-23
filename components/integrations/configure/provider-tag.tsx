"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useProviderAccountLabelMap } from "@/components/integrations/configure/use-provider-account-labels"
import { getProviderOptionMeta } from "@/lib/provider-configuration-options"
import { cn } from "@/lib/utils"

export function ProviderTag({
  providerId,
  onRemove,
  className,
}: {
  providerId: string
  onRemove?: () => void
  className?: string
}) {
  const accountLabels = useProviderAccountLabelMap()
  const { label, badge, logo } = getProviderOptionMeta(providerId, accountLabels)

  return (
    <span
      className={cn(
        "inline-flex h-6 max-h-6 min-h-6 items-center gap-0.5 rounded border border-[#d0d5dd] bg-white px-2",
        className
      )}
    >
      <span className="relative size-4 shrink-0 overflow-hidden">
        <Image
          src={logo}
          alt=""
          width={16}
          height={16}
          unoptimized
          className="size-4 object-contain"
          aria-hidden
        />
      </span>
      <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054]">
        {label}
      </span>
      {badge ? (
        <span className="inline-flex h-[18px] items-center rounded-[2px] bg-[#f2f4f7] px-[5px] font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054]">
          {badge}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}${badge ? ` ${badge}` : ""}`}
          className="ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-[10px] text-[#475467] opacity-50 outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#84adff]"
        >
          <X className="size-2.5" strokeWidth={2} aria-hidden />
        </button>
      ) : null}
    </span>
  )
}
