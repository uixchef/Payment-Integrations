"use client"

import {
  Check,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react"
import {
  formatSyncTimestamp,
  type StripeSyncCompleted,
} from "./stripe-sync-progress"
import { cn } from "@/lib/utils"

const CARD_SHADOW =
  "shadow-[0px_1px_1.5px_rgba(16,24,40,0.1),0px_1px_1px_rgba(16,24,40,0.06)]"

type ResultStatRows = {
  synced: number
  pending: number
  error: number
  pendingNil?: boolean
  showSyncedInfo?: boolean
}

function Share04Icon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "size-6 shrink-0 text-[#667085] transition-colors group-hover:text-[#101828]",
        className
      )}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 9V3m0 0h-6m6 0-8 8m-3-6H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 7.28 3 8.12 3 9.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C19 18.72 19 17.88 19 16.2V14" />
    </svg>
  )
}

function ResultStatCard({
  title,
  rows,
}: {
  title: string
  rows: ResultStatRows
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col rounded border border-[#d0d5dd] bg-white",
        CARD_SHADOW
      )}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {title}
        </h3>
        <button
          type="button"
          aria-label={`Open ${title} in Stripe`}
          className="group flex size-6 shrink-0 items-center justify-center rounded outline-none focus-visible:ring-2 focus-visible:ring-[#84adff]"
        >
          <Share04Icon />
        </button>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <StatRow
          label="Synced"
          value={rows.synced}
          showInfo={rows.showSyncedInfo}
        />
        <Divider />
        <StatRow
          label="Pending"
          value={rows.pending}
          pendingNil={rows.pendingNil}
        />
        <Divider />
        <StatRow label="Error" value={rows.error} />
      </div>
    </div>
  )
}

function StatRow({
  label,
  value,
  pendingNil,
  showInfo,
}: {
  label: string
  value: number
  pendingNil?: boolean
  showInfo?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
        {label}
      </span>
      {pendingNil ? (
        <span className="inline-flex h-6 min-h-6 max-h-6 items-center rounded-full bg-[#fffaeb] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#b54708]">
          NIL
        </span>
      ) : (
        <div className="flex items-center gap-1">
          <span className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
            {value}
          </span>
          {showInfo ? (
            <Info
              className="size-4 text-[#667085]"
              strokeWidth={1.75}
              aria-hidden
            />
          ) : null}
        </div>
      )}
    </div>
  )
}

function Divider() {
  return <div className="h-px w-full bg-[#eaecf0]" />
}

function ChecklistDoneIcon() {
  return (
    <span className="inline-flex h-6 min-h-6 max-h-6 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] px-1">
      <Check className="size-4 text-[#004eeb]" strokeWidth={2.5} aria-hidden />
    </span>
  )
}

function ChecklistPendingIcon() {
  return (
    <span
      aria-hidden
      className="inline-block size-6 shrink-0 rounded-full border-2 border-[#b2ccff] bg-white"
    />
  )
}

const CHECKLIST_ITEMS = [
  {
    id: "subscriptions",
    done: true,
    label: "Verify subscription list in Payments > Subscriptions tab.",
  },
  {
    id: "triggers",
    done: true,
    label:
      "Confirm workflow triggers are active for invoice.paid and invoice.payment_failed.",
  },
  {
    id: "contacts",
    done: true,
    label:
      "Verify contacts from the contacts page on the left nav bar and check if saved payment methods are showing up.",
  },
] as const

export function StepSyncResults({
  completed,
}: {
  completed: StripeSyncCompleted
}) {
  const { date, time } = formatSyncTimestamp(completed.completedAt)
  const { results } = completed

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-start gap-2 rounded bg-[#f6fef9] p-2">
        <CheckCircle2
          className="mt-0.5 size-5 shrink-0 text-[#027a48]"
          strokeWidth={1.75}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#027a48]">
            Sync complete
          </p>
          <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#027a48]">
            Last synced just now. New Stripe events won&apos;t import until you
            re-sync.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]">
          Last sync
        </span>
        <div className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          <span>{date}</span>
          <span className="font-normal">at</span>
          <span>{time}</span>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <ResultStatCard
          title="Subscriptions"
          rows={{
            synced: results.subscriptions.synced,
            pending: results.subscriptions.pending,
            error: results.subscriptions.error,
            showSyncedInfo: true,
          }}
        />
        <ResultStatCard
          title="Contacts"
          rows={{
            synced: results.customers.synced,
            pending: results.customers.pending,
            error: results.customers.error,
          }}
        />
        <ResultStatCard
          title="Payment methods"
          rows={{
            synced: results.paymentMethods.synced,
            pending: results.paymentMethods.pending,
            error: results.paymentMethods.error,
            pendingNil: results.paymentMethods.pendingNil,
          }}
        />
      </div>

      <div
        className={cn(
          "flex w-full flex-col rounded border border-[#d0d5dd] bg-white",
          CARD_SHADOW
        )}
      >
        <div className="px-4 pt-4">
          <h3 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Post import checklist
          </h3>
        </div>
        <div className="flex flex-col gap-3 p-4">
          {CHECKLIST_ITEMS.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-3">
              <div
                className={cn(
                  "flex gap-2",
                  item.done ? "items-center" : "items-start"
                )}
              >
                {item.done ? <ChecklistDoneIcon /> : <ChecklistPendingIcon />}
                <p
                  className={cn(
                    "font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]",
                    !item.done && "min-w-0 flex-1"
                  )}
                >
                  {item.label}
                </p>
              </div>
              {index < CHECKLIST_ITEMS.length - 1 ? <Divider /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ResultsFooter({
  onResync,
  onDone,
}: {
  onResync: () => void
  onDone: () => void
}) {
  return (
    <footer className="flex shrink-0 flex-col pb-3">
      <div className="h-px bg-[#eaecf0]" />
      <div className="flex items-center justify-end gap-3 px-4 pt-3">
        <button
          type="button"
          onClick={onResync}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-2 rounded border border-[#d0d5dd]",
            "bg-white px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
            "text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
            "hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          <RefreshCw className="size-4" strokeWidth={2} aria-hidden />
          Re-sync
        </button>
        <button
          type="button"
          onClick={onDone}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded border border-[#155eef]",
            "bg-[#155eef] px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
            "text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
            "hover:bg-[#004eeb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          Done
        </button>
      </div>
    </footer>
  )
}
