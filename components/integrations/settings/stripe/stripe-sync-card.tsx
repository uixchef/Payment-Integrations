"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, PieChart, RefreshCw } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  formatLastSyncLabel,
  type StripeSyncCompleted,
  type StripeSyncInProgress,
  type StripeSyncState,
} from "@/components/integrations/settings/stripe/sync/stripe-sync-progress"
import { cn } from "@/lib/utils"

const STRIPE_SYNC_DOCS_HREF =
  "https://help.gohighlevel.com/support/solutions/articles/48000980323-stripe-integration"

function StripeSyncCardDescription() {
  return (
    <p className="font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
      Import saved customers, payment methods, and subscriptions seamlessly.{" "}
      <a
        href={STRIPE_SYNC_DOCS_HREF}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-[#004eeb] outline-none transition-colors hover:text-[#0040c1] focus-visible:underline"
      >
        Learn more.
      </a>
    </p>
  )
}

type StripeSyncCardProps = {
  enabled: boolean
  syncState?: StripeSyncState | null
  onSync?: () => void
  onViewDetails?: () => void
  onResync?: () => void
}

function SyncStatusTag({
  variant,
  children,
}: {
  variant: "success" | "warning"
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2",
        "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
        variant === "success" && "bg-[#ecfdf3] text-[#027a48]",
        variant === "warning" && "bg-[#fffaeb] text-[#b54708]"
      )}
    >
      {children}
    </span>
  )
}

function SyncProgressRow({
  label,
  status,
  progressPercent,
}: {
  label: string
  status: React.ReactNode
  progressPercent: number
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="flex-1 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#101828]">
          {label}
        </span>
        <div className="shrink-0 text-right font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
          {status}
        </div>
      </div>
      <div className="flex h-4 items-center">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#eaecf0]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#039855] transition-[width] duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function SyncSummaryRow({
  label,
  tag,
  count,
  showDivider,
}: {
  label: string
  tag: React.ReactNode
  count: number
  showDivider?: boolean
}) {
  return (
    <>
      <div className="flex items-center justify-between bg-white p-3">
        <div className="flex min-w-0 items-center gap-1">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#475467]">
            {label}
          </span>
          {tag}
        </div>
        <span className="shrink-0 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          {count}
        </span>
      </div>
      {showDivider ? <div className="h-px bg-[#eaecf0]" /> : null}
    </>
  )
}

function StripeSyncIncompleteCard({
  onContinue,
}: {
  onContinue: () => void
}) {
  return (
    <aside
      aria-label="Stripe data syncing incomplete"
      className="flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fef0c7]">
          <PieChart
            className="size-6 text-[#dc6803]"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
        <h2 className="flex-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          Stripe data syncing incomplete
        </h2>
      </div>

      <StripeSyncCardDescription />

      <button
        type="button"
        onClick={onContinue}
        className={cn(
          "inline-flex h-9 w-full items-center justify-center gap-2 rounded border border-[#d0d5dd]",
          "bg-white px-3.5 py-2 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
          "text-[#475467] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
          "hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
        )}
      >
        Continue syncing
        <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
      </button>
    </aside>
  )
}

function StripeSyncInProgressCard({
  progress,
}: {
  progress: StripeSyncInProgress
}) {
  const [lastSyncLabel, setLastSyncLabel] = useState(() =>
    formatLastSyncLabel(progress.startedAt)
  )

  useEffect(() => {
    setLastSyncLabel(formatLastSyncLabel(progress.startedAt))
    const timer = window.setInterval(() => {
      setLastSyncLabel(formatLastSyncLabel(progress.startedAt))
    }, 30_000)
    return () => window.clearInterval(timer)
  }, [progress.startedAt])

  return (
    <aside
      aria-label="Stripe data syncing in progress"
      aria-busy="true"
      className="flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fef0c7]">
          <PieChart
            className="size-6 text-[#dc6803]"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
            Stripe data syncing in progress
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
            {lastSyncLabel}
          </p>
        </div>
      </div>

      <SyncProgressRow
        label="Subscriptions"
        progressPercent={progress.subscriptions.progressPercent}
        status={
          <>
            <span className="font-medium text-[#101828]">
              {progress.subscriptions.synced}
            </span>
            {" synced · "}
            <span className="text-[#b54708]">
              {progress.subscriptions.pending} pending
            </span>
          </>
        }
      />

      <SyncProgressRow
        label="Contacts"
        progressPercent={progress.customers.progressPercent}
        status={
          <>
            <span className="font-medium text-[#101828]">
              {progress.customers.synced}
            </span>
            {" synced · all matched"}
          </>
        }
      />

      <SyncProgressRow
        label="Payment methods"
        progressPercent={progress.paymentMethods.progressPercent}
        status={
          <>
            <span className="font-medium text-[#101828]">
              {progress.paymentMethods.synced}
            </span>
            {` synced · ${progress.paymentMethods.errors} errors`}
          </>
        }
      />

    </aside>
  )
}

function StripeSyncCompletedCard({
  completed,
  onResync,
  onViewDetails,
}: {
  completed: StripeSyncCompleted
  onResync: () => void
  onViewDetails: () => void
}) {
  const [lastSyncLabel, setLastSyncLabel] = useState(() =>
    formatLastSyncLabel(completed.completedAt)
  )

  useEffect(() => {
    setLastSyncLabel(formatLastSyncLabel(completed.completedAt))
    const timer = window.setInterval(() => {
      setLastSyncLabel(formatLastSyncLabel(completed.completedAt))
    }, 30_000)
    return () => window.clearInterval(timer)
  }, [completed.completedAt])

  return (
    <aside
      aria-label="Stripe sync completed"
      className="flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#d1fadf]">
          <CheckCircle2
            className="size-6 text-[#039855]"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
            Stripe data syncing completed
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
            {lastSyncLabel}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden rounded border border-[#eaecf0]">
        <SyncSummaryRow
          label="Subscriptions"
          count={completed.subscriptions.total}
          tag={<SyncStatusTag variant="success">All synced</SyncStatusTag>}
          showDivider
        />
        <SyncSummaryRow
          label="Contacts"
          count={completed.customers.total}
          tag={<SyncStatusTag variant="success">All matched</SyncStatusTag>}
          showDivider
        />
        <SyncSummaryRow
          label="Payment methods"
          count={completed.paymentMethods.total}
          tag={
            completed.paymentMethods.pending > 0 ? (
              <SyncStatusTag variant="warning">
                {completed.paymentMethods.pending} pending - retry
              </SyncStatusTag>
            ) : (
              <SyncStatusTag variant="success">All synced</SyncStatusTag>
            )
          }
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={onResync}
          className={cn(
            "inline-flex h-9 w-full items-center justify-center gap-2 rounded border border-[#f9fafb]",
            "bg-[#f9fafb] px-3.5 py-2 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
            "text-[#475467] outline-none transition-colors",
            "hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          <RefreshCw className="size-5" strokeWidth={2} aria-hidden />
          Re-sync
        </button>
        <button
          type="button"
          onClick={onViewDetails}
          className={cn(
            "inline-flex h-9 w-full items-center justify-center gap-2 rounded border border-[#d0d5dd]",
            "bg-white px-3.5 py-2 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
            "text-[#475467] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none transition-colors",
            "hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          View details
          <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </aside>
  )
}

export function StripeSyncCard({
  enabled,
  syncState,
  onSync,
  onViewDetails,
  onResync,
}: StripeSyncCardProps) {
  const router = useRouter()

  if (syncState?.status === "incomplete") {
    return (
      <StripeSyncIncompleteCard
        onContinue={() => {
          onSync?.()
          router.push("/integrations/stripe/sync")
        }}
      />
    )
  }

  if (syncState?.status === "in-progress") {
    return (
      <StripeSyncInProgressCard progress={syncState} />
    )
  }

  if (syncState?.status === "completed") {
    return (
      <StripeSyncCompletedCard
        completed={syncState}
        onViewDetails={onViewDetails ?? (() => {})}
        onResync={
          onResync ??
          (() => {
            onSync?.()
            router.push("/integrations/stripe/sync")
          })
        }
      />
    )
  }

  const syncButton = (
    <button
      type="button"
      aria-disabled={!enabled}
      onClick={() => {
        if (!enabled) return
        onSync?.()
        router.push("/integrations/stripe/sync")
      }}
      className={cn(
        "inline-flex h-9 w-full items-center justify-center gap-2 rounded border bg-white px-3.5 py-2",
        "font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
        "outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[#84adff]",
        enabled
          ? "cursor-pointer border-[#84adff] text-[#004eeb] shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#f5f8ff]"
          : "cursor-not-allowed border-[#b2ccff] text-[#b2ccff] shadow-none"
      )}
    >
      Start Stripe sync
      <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
    </button>
  )

  return (
    <aside
      aria-label="Sync your existing Stripe data"
      className="flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#d1e0ff]">
          <Image
            src="/integrations/stripe/refresh-ccw-03.png"
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-6"
            aria-hidden
          />
        </span>
        <h2 className="flex-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          Sync your existing Stripe data
        </h2>
      </div>

      <StripeSyncCardDescription />

      {enabled ? (
        syncButton
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>{syncButton}</TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="max-w-[260px]">
            Connect a Stripe account to sync your existing payment data.
          </TooltipContent>
        </Tooltip>
      )}
    </aside>
  )
}
