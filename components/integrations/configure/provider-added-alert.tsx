"use client"

import { CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProviderAddedAlert({
  open,
  onDismiss,
  className,
}: {
  open: boolean
  onDismiss: () => void
  className?: string
}) {
  if (!open) return null

  return (
    <div
      role="status"
      className={cn(
        "flex w-max max-w-[calc(100vw-2rem)] items-center gap-2 rounded-lg border border-[#6ce9a6] bg-[#f6fef9] p-2",
        className
      )}
    >
      <CheckCircle2
        className="size-5 shrink-0 text-[#027a48]"
        strokeWidth={1.75}
        aria-hidden
      />
      <p className="whitespace-nowrap font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#027a48]">
        Provider successfully added
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss alert"
        className="inline-flex size-5 shrink-0 items-center justify-center rounded text-[#475467] outline-none hover:bg-[#ecfdf3] focus-visible:ring-2 focus-visible:ring-[#6ce9a6]"
      >
        <X className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  )
}
