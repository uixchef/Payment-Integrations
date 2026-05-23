"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function SetAsDefaultButton({
  disabled,
  tooltip,
  onClick,
  className,
}: {
  disabled: boolean
  tooltip: string
  onClick: () => void
  className?: string
}) {
  const button = (
    <Button
      type="button"
      variant="neutral"
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "px-2.5",
        disabled &&
          "cursor-not-allowed border-[#eaecf0] bg-white text-[#98a2b3] shadow-none hover:border-[#eaecf0] hover:bg-white hover:text-[#98a2b3]",
        className
      )}
    >
      Set as default
    </Button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-[300px]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
