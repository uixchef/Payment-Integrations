"use client"

import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Plus,
  Truck,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ManualPaymentEmptyStateContent } from "@/lib/manual-payment-data"
import { cn } from "@/lib/utils"

const TILE_ICONS = {
  check: CheckCircle2,
  card: CreditCard,
  banknote: Banknote,
} as const

function EmptyIllustration({
  type,
}: {
  type: ManualPaymentEmptyStateContent["illustration"]
}) {
  const Icon = type === "truck" ? Truck : Wallet

  return (
    <div
      className="flex size-[110px] items-center justify-center rounded-full bg-[#f2f4f7]"
      aria-hidden
    >
      <Icon className="size-14 text-[#475467]" strokeWidth={1.25} />
    </div>
  )
}

export function ManualPaymentEmptyState({
  content,
  onEnable,
}: {
  content: ManualPaymentEmptyStateContent
  onEnable: () => void
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 py-20">
      <EmptyIllustration type={content.illustration} />

      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {content.title}
        </h2>
        <p className="max-w-[560px] font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
          {content.description}
        </p>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        {content.tiles.map((tile) => {
          const TileIcon = TILE_ICONS[tile.icon]
          return (
            <div
              key={tile.text}
              className="flex flex-col items-center gap-2 rounded-lg bg-[#f2f4f7] p-2 text-center"
            >
              <TileIcon
                className="size-4 text-[#475467]"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
                {tile.text}
              </p>
            </div>
          )
        })}
      </div>

      <Button
        type="button"
        onClick={onEnable}
        className={cn(
          "h-10 gap-2 rounded-[8px] px-3.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
          "bg-[#155eef] text-white hover:bg-[#004eeb]"
        )}
      >
        <Plus className="size-5" strokeWidth={2} aria-hidden />
        {content.enableLabel}
      </Button>
    </div>
  )
}
