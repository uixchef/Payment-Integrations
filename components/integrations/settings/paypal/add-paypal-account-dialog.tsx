"use client"

import * as React from "react"
import { Info, X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function AddPayPalAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  mode = "add",
  initialValue = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (label: string) => void
  mode?: "add" | "edit"
  initialValue?: string
}) {
  const [label, setLabel] = React.useState(initialValue)

  React.useEffect(() => {
    if (open) {
      setLabel(initialValue)
    } else {
      setLabel("")
    }
  }, [open, initialValue])

  const trimmed = label.trim()
  const canSubmit = trimmed.length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onConfirm(trimmed)
    onOpenChange(false)
  }

  const title =
    mode === "edit"
      ? "Edit PayPal account display name"
      : "Add new PayPal account"

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[100] bg-[rgba(16,24,40,0.7)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          onEscapeKeyDown={() => onOpenChange(false)}
          onPointerDownOutside={() => onOpenChange(false)}
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] w-[460px] max-w-[calc(100vw-2rem)]",
            "-translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-[8px] border border-[#f2f4f7] bg-white outline-none",
            "shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
        >
          <div className="flex w-full items-center gap-2 px-4 pt-4">
            <DialogPrimitive.Title className="flex-1 truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Name this PayPal account, then continue to connect it.
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              aria-label="Close"
              className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#667085] outline-none transition-colors hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-1">
              <label
                htmlFor="paypal-account-name"
                className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]"
              >
                Account name
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="What is the account name used for?"
                    className="flex size-3 shrink-0 cursor-help items-center justify-center text-[#101828] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#84adff]"
                  >
                    <Info className="size-3" strokeWidth={1.75} aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4} className="max-w-[240px]">
                  This abbreviation is for internal reference only.
                </TooltipContent>
              </Tooltip>
            </div>
            <input
              id="paypal-account-name"
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Enter account name"
              maxLength={50}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter" && canSubmit) {
                  event.preventDefault()
                  handleSubmit()
                }
              }}
              className={cn(
                "flex h-9 w-full rounded border border-[#d0d5dd] bg-white px-2",
                "font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828]",
                "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#667085]",
                "focus:border-[#84adff] focus:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
              )}
            />
          </div>

          <div className="border-t border-[#eaecf0]">
            <div className="flex items-center justify-end px-4 py-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                className={cn(
                  "inline-flex h-9 items-center rounded px-2.5",
                  "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
                  "shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-[#84adff]",
                  canSubmit
                    ? "cursor-pointer bg-[#155eef] hover:bg-[#004eeb]"
                    : "cursor-not-allowed bg-[#b2ccff]"
                )}
              >
                Done
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
