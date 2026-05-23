"use client"

import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Info, Plus } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function TooltipCaret() {
  return (
    <div className="relative h-1.5 w-4 shrink-0" aria-hidden>
      <div className="absolute -top-px left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-b border-r border-[#d0d5dd] bg-[#fcfcfd]" />
    </div>
  )
}

function TooltipPanel() {
  return (
    <div className="w-[438px] rounded border border-[#d0d5dd] bg-[#fcfcfd] p-2 shadow-[0px_12px_8px_rgba(16,24,40,0.08),0px_4px_3px_rgba(16,24,40,0.03)]">
      <div className="flex gap-2">
        <Info
          className="mt-0.5 size-4 shrink-0 text-[#475467]"
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-col gap-0.5">
            <p className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
              No provider connected
            </p>
            <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
              You can&apos;t add payment provider because none-other are
              connected. Connect a provider first to enable this button.
            </p>
          </div>
          <Link
            href="/integrations?status=all"
            className="inline-flex items-center gap-2 self-start font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#004eeb] outline-none hover:text-[#0040c1] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          >
            Connect
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function NoProviderConnectedTooltip({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  const openTooltip = useCallback(() => {
    clearCloseTimeout()
    setOpen(true)
  }, [clearCloseTimeout])

  const scheduleClose = useCallback(() => {
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false)
      closeTimeoutRef.current = null
    }, 120)
  }, [clearCloseTimeout])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          className="inline-flex"
          tabIndex={0}
          onMouseEnter={openTooltip}
          onMouseLeave={scheduleClose}
          onFocus={openTooltip}
          onBlur={scheduleClose}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="top"
        sideOffset={10}
        className="z-[110] w-auto border-0 bg-transparent p-0 shadow-none"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onMouseEnter={openTooltip}
        onMouseLeave={scheduleClose}
      >
        <div className="flex flex-col items-center">
          <TooltipPanel />
          <TooltipCaret />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function DisabledAddProviderButton() {
  return (
    <NoProviderConnectedTooltip>
      <button
        type="button"
        aria-disabled
        aria-label="Add payment provider"
        className={cn(
          "inline-flex size-6 cursor-not-allowed items-center justify-center rounded border border-[#eaecf0] bg-white text-[#98a2b3] outline-none"
        )}
      >
        <Plus className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </NoProviderConnectedTooltip>
  )
}
