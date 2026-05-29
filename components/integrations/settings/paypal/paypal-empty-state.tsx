"use client"

import Image from "next/image"
import { ExternalLink, Play } from "lucide-react"
import { cn } from "@/lib/utils"

type PayPalEmptyStateProps = {
  onWatchVideo: () => void
  onConnect: () => void
}

export function PayPalEmptyState({
  onWatchVideo,
  onConnect,
}: PayPalEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 pb-20 pt-6 text-center">
      <AvatarPlaceholder />
      <div className="flex max-w-[560px] flex-col items-center gap-1">
        <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          No account connected
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
          PayPal supports cards, digital wallets, bank transfers, and buy now
          pay later options so customers can pay the way they prefer.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onWatchVideo}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center gap-2 rounded-[8px] border border-[#d0d5dd] bg-white px-3.5",
            "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#475467]",
            "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
            "hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          <Play
            className="size-5 shrink-0 fill-current"
            strokeWidth={0}
            aria-hidden
          />
          Watch setup video
        </button>
        <button
          type="button"
          onClick={onConnect}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center gap-2 rounded-[8px] bg-[#155eef] px-3.5",
            "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
            "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
            "hover:bg-[#004eeb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          Connect with PayPal
          <ExternalLink
            className="size-5 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}

function AvatarPlaceholder() {
  return (
    <Image
      src="/integrations/stripe/no-account-avatar.png"
      alt=""
      width={110}
      height={127}
      priority
      className="select-none"
      aria-hidden
    />
  )
}
