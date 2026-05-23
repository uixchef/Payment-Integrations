"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SwitchSize = "sm" | "md"

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: SwitchSize
}

const ROOT_SIZE: Record<SwitchSize, string> = {
  // sm matches the Figma "md" toggle (20×36, 16px thumb)
  sm: "h-5 w-9",
  // md preserves the legacy 24×44 footprint used elsewhere in the app
  md: "h-6 w-11",
}

const THUMB_SIZE: Record<SwitchSize, string> = {
  // size-4 thumb, slide = root-width(36) - padding*2(4) - thumb(16) = 16px
  sm: "size-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5",
  // size-5 thumb, slide = root-width(44) - padding*2(4) - thumb(20) = 22px
  md: "size-5 data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5",
}

function Switch({ className, size = "md", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none",
        "border border-transparent",
        "focus-visible:ring-2 focus-visible:ring-[#84adff] focus-visible:ring-offset-2",
        "data-[state=checked]:bg-[#155eef] data-[state=unchecked]:bg-[#d0d5dd]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        ROOT_SIZE[size],
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.16)] transition-transform",
          THUMB_SIZE[size]
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
