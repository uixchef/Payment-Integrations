"use client"

import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function AddAccountButton({
  disabled,
  disabledReason,
  onAddAccount,
}: {
  disabled: boolean
  disabledReason?: string
  onAddAccount: () => void
}) {
  const button = (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={disabled ? undefined : onAddAccount}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-[8px] px-3.5 py-2",
        "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 outline-none transition-colors",
        disabled
          ? "cursor-not-allowed text-[#98a2b3]"
          : "cursor-pointer text-[#344054] hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      )}
    >
      <Plus className="size-5" strokeWidth={2} aria-hidden />
      Add account
    </button>
  )

  if (!disabled) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-[300px]">
        {disabledReason}
      </TooltipContent>
    </Tooltip>
  )
}
