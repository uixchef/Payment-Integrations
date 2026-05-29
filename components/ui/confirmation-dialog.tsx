"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { AlertTriangle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ConfirmationDialogVariant = "warning" | "destructive" | "primary"

const VARIANT_STYLES: Record<
  ConfirmationDialogVariant,
  { iconColor: string; confirmBg: string; confirmHover: string }
> = {
  warning: {
    iconColor: "text-[#dc6803]",
    confirmBg: "bg-[#dc6803] border-[#dc6803]",
    confirmHover: "hover:bg-[#b54708] hover:border-[#b54708]",
  },
  destructive: {
    iconColor: "text-[#d92d20]",
    confirmBg: "bg-[#d92d20] border-[#d92d20]",
    confirmHover: "hover:bg-[#b42318] hover:border-[#b42318]",
  },
  primary: {
    iconColor: "text-[#101828]",
    confirmBg: "bg-[#155eef] border-[#155eef]",
    confirmHover: "hover:bg-[#004eeb] hover:border-[#004eeb]",
  },
}

export type ConfirmationDialogFooterLayout = "end" | "split"

export type ConfirmationDialogCancelVariant = "neutral" | "warning-outline"

export type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  variant?: ConfirmationDialogVariant
  footerLayout?: ConfirmationDialogFooterLayout
  cancelVariant?: ConfirmationDialogCancelVariant
  /** Override the default header icon (defaults to AlertTriangle). */
  icon?: React.ReactNode
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "warning",
  footerLayout = "end",
  cancelVariant = "neutral",
  icon,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const styles = VARIANT_STYLES[variant]

  const handleDismiss = () => {
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

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
          onEscapeKeyDown={handleDismiss}
          onPointerDownOutside={handleDismiss}
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] w-[483px] max-w-[calc(100vw-2rem)]",
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
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {icon ? (
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center",
                    styles.iconColor
                  )}
                  aria-hidden
                >
                  {icon}
                </span>
              ) : (
                <AlertTriangle
                  className={cn("size-6 shrink-0", styles.iconColor)}
                  strokeWidth={1.75}
                  aria-hidden
                />
              )}
              <DialogPrimitive.Title className="truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
                {title}
              </DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#667085] outline-none transition-colors hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <div className="flex w-full flex-col p-4">
            <DialogPrimitive.Description asChild>
              <div className="space-y-4 font-[family-name:var(--font-inter)] text-base font-normal leading-6 text-[#475467]">
                {description}
              </div>
            </DialogPrimitive.Description>
          </div>

          <div className="flex w-full flex-col pb-3">
            <div className="h-px w-full bg-[#eaecf0]" />
            <div
              className={cn(
                "flex items-center gap-4 px-4 pt-3",
                footerLayout === "split" ? "justify-between" : "justify-end"
              )}
            >
              <Button
                type="button"
                variant="neutral"
                onClick={handleCancel}
                className={cn(
                  "px-2.5",
                  cancelVariant === "warning-outline" &&
                    "border-[#fec84b] bg-white text-[#b54708] hover:border-[#fec84b] hover:bg-[#fffaeb] hover:text-[#b54708]"
                )}
              >
                {cancelLabel}
              </Button>
              <button
                type="button"
                onClick={handleConfirm}
                className={cn(
                  "inline-flex h-9 items-center justify-center gap-2 rounded border px-2.5 outline-none transition-colors",
                  "font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
                  "shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
                  "focus-visible:ring-2 focus-visible:ring-[#84adff]",
                  styles.confirmBg,
                  styles.confirmHover
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
