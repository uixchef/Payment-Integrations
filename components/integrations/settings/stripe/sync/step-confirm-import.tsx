"use client"

import { AlertTriangle, Clock, ShieldCheck, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioCard } from "./sync-primitives"

export type AutomationBehavior = "no-trigger" | "future-only" | "on-import"

export type ConfirmSummary = {
  subscriptions: number
  contacts: number
  paymentMethods: number
}

const SUMMARY_ROWS: Array<{ id: keyof ConfirmSummary; label: string }> = [
  { id: "subscriptions", label: "Subscriptions" },
  { id: "contacts", label: "Contacts" },
  { id: "paymentMethods", label: "Payment method references" },
]

const AUTOMATION_OPTIONS: Array<{
  id: AutomationBehavior
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    id: "no-trigger",
    title: "Do not trigger any workflows",
    description: "Import silently. No automation fires.",
    icon: ShieldCheck,
  },
  {
    id: "future-only",
    title: "Trigger on future billing events only",
    description: "Workflows fire on the first invoice event after import.",
    icon: Clock,
  },
  {
    id: "on-import",
    title: "Trigger on import",
    description: "Fires subscription created immediately for each record.",
    icon: Zap,
  },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
      {children}
    </p>
  )
}

export function StepConfirmImport({
  summary,
  behavior,
  onBehaviorChange,
}: {
  summary: ConfirmSummary
  behavior: AutomationBehavior
  onBehaviorChange: (next: AutomationBehavior) => void
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col gap-1">
        <SectionLabel>Import summary</SectionLabel>
        <div className="flex w-full flex-col">
          {SUMMARY_ROWS.map((row, index) => {
            const isFirst = index === 0
            const isLast = index === SUMMARY_ROWS.length - 1
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
                <span className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
                  {summary[row.id]} selected
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <SectionLabel>Workflow automation behavior</SectionLabel>
        <div className="flex flex-col gap-2">
          {AUTOMATION_OPTIONS.map((option) => (
            <RadioCard
              key={option.id}
              name="automation-behavior"
              value={option.id}
              selectedValue={behavior}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onSelect={(next) => onBehaviorChange(next as AutomationBehavior)}
            />
          ))}
        </div>
      </section>

      <div
        role="status"
        className="flex items-start gap-2 rounded-[4px] bg-[#fffcf5] p-2"
      >
        <AlertTriangle
          className="size-5 shrink-0 text-[#b54708]"
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#b54708]">
            Re-running this import will not create duplicates.
          </p>
          <p className="font-[family-name:var(--font-inter)] text-sm font-normal leading-5 text-[#b54708]">
            Stripe remains the source of truth for billing. We match on Stripe
            customer ID and subscription ID: imported records sync forward
            automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
