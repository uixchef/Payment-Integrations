"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import type { ConfirmSummary } from "./step-confirm-import"

const PROGRESS_STAGES = [
  { progress: 0, label: "Syncing contacts..." },
  { progress: 40, label: "Syncing contacts..." },
  { progress: 65, label: "Syncing subscriptions..." },
  { progress: 85, label: "Syncing payment methods..." },
] as const

type QueueRow = {
  id: keyof ConfirmSummary
  label: string
}

const QUEUE_ROWS: QueueRow[] = [
  { id: "subscriptions", label: "Subscriptions" },
  { id: "contacts", label: "Contacts" },
  { id: "paymentMethods", label: "Payment methods" },
]

const DOT_COLORS = [
  "bg-[#004eeb]",
  "bg-[#84adff] mix-blend-multiply",
  "bg-[#eff4ff] mix-blend-multiply",
] as const

function SyncQueueDots() {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {DOT_COLORS.map((colorClass, index) => (
        <span
          key={index}
          className={cn("size-2 rounded-[4px] animate-sync-queue-dot", colorClass)}
          style={{ animationDelay: `${index * 0.18}s` }}
        />
      ))}
    </div>
  )
}

export function StripeSyncImportingModal({
  open,
  onOpenChange,
  logo,
  summary,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  logo: string
  summary: ConfirmSummary
}) {
  const [stageIndex, setStageIndex] = useState(0)
  const stage = PROGRESS_STAGES[stageIndex] ?? PROGRESS_STAGES[0]

  useEffect(() => {
    if (!open) {
      setStageIndex(0)
      return
    }

    setStageIndex(0)
    const timers: number[] = []

    PROGRESS_STAGES.slice(1).forEach((_, index) => {
      timers.push(
        window.setTimeout(() => setStageIndex(index + 1), 350 + index * 2400)
      )
    })

    return () => timers.forEach(window.clearTimeout)
  }, [open])

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
            "fixed left-1/2 top-1/2 z-[101] w-[512px] max-w-[calc(100vw-2rem)]",
            "-translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-[8px] border border-[#f2f4f7] bg-white outline-none",
            "shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
        >
            <DialogPrimitive.Title className="sr-only">
              Syncing from Stripe
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Import in progress. You can close this dialog and return later.
            </DialogPrimitive.Description>

            <DialogPrimitive.Close
              aria-label="Close"
              className={cn(
                "absolute right-6 top-6 flex size-5 cursor-pointer items-center justify-center",
                "rounded text-[#667085] outline-none transition-colors",
                "hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
              )}
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </DialogPrimitive.Close>

            <div className="flex flex-col items-center gap-4 p-6">
              <span className="flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[8px]">
                <Image
                  src={logo}
                  alt=""
                  width={52}
                  height={52}
                  unoptimized
                  className="size-[52px] object-contain"
                  aria-hidden
                />
              </span>

              <div className="flex w-full flex-col items-center gap-1 text-center">
                <p className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
                  Syncing from Stripe...
                </p>
                <p className="font-[family-name:var(--font-inter)] text-sm font-normal leading-5 text-[#475467]">
                  This may take a moment. You can close this page and come back.
                </p>
              </div>

              <div className="flex w-full flex-col gap-1">
                <div className="flex h-4 items-center">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#eaecf0]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#155eef] transition-[width] duration-700 ease-out"
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-center font-[family-name:var(--font-inter)] text-sm font-normal leading-5 text-[#475467]">
                  {stage.label}
                </p>
              </div>

              <div className="flex w-full flex-col">
                {QUEUE_ROWS.map((row, index) => {
                  const isFirst = index === 0
                  const isLast = index === QUEUE_ROWS.length - 1
                  return (
                    <div
                      key={row.id}
                      className={cn(
                        "flex items-center justify-between border-[#d0d5dd] bg-white px-3 py-2",
                        isFirst && "rounded-t-[4px] border border-b-0",
                        !isFirst && !isLast && "border-x border-t",
                        isLast && "rounded-b-[4px] border"
                      )}
                    >
                      <span className="font-[family-name:var(--font-inter)] text-base font-normal leading-6 text-[#475467]">
                        {row.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <SyncQueueDots />
                        <span className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
                          {summary[row.id]} queued
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
