export type StripeSyncSummaryInput = {
  subscriptions: number
  contacts: number
  paymentMethods: number
}

export type StripeSyncInProgress = {
  status: "in-progress"
  startedAt: number
  summary: StripeSyncSummaryInput
  subscriptions: {
    synced: number
    total: number
    pending: number
    progressPercent: number
  }
  customers: {
    synced: number
    total: number
    progressPercent: number
  }
  paymentMethods: {
    synced: number
    total: number
    errors: number
    progressPercent: number
  }
}

export type StripeSyncResultBreakdown = {
  synced: number
  pending: number
  error: number
  pendingNil?: boolean
}

export type StripeSyncCompleted = {
  status: "completed"
  startedAt: number
  completedAt: number
  summary: StripeSyncSummaryInput
  subscriptions: {
    total: number
  }
  customers: {
    total: number
  }
  paymentMethods: {
    total: number
    pending: number
  }
  results: {
    subscriptions: StripeSyncResultBreakdown
    customers: StripeSyncResultBreakdown
    paymentMethods: StripeSyncResultBreakdown
  }
}

import type { StripeSyncIncomplete } from "./stripe-sync-draft"

export type StripeSyncState =
  | StripeSyncInProgress
  | StripeSyncCompleted
  | StripeSyncIncomplete

/** Mock background import duration before the settings card moves to completed. */
export const STRIPE_SYNC_COMPLETE_DELAY_MS = 10_000

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

function phaseProgress(
  elapsedRatio: number,
  start: number,
  end: number
): number {
  if (elapsedRatio <= start) return 0
  if (elapsedRatio >= end) return 1
  return smoothstep((elapsedRatio - start) / (end - start))
}

function pendingSubscriptionsAtCompletion(total: number): number {
  if (total <= 0) return 0
  return Math.min(2, Math.max(1, Math.round(total * 0.04)))
}

function pendingPaymentMethodsAtCompletion(total: number): number {
  if (total <= 0) return 0
  return Math.min(2, Math.max(1, Math.round(total * 0.17)))
}

export type CompletedSummaryTag = {
  variant: "success" | "warning"
  label: string
}

export type CompletedSummaryRow = {
  label: string
  count: number
  tag: CompletedSummaryTag
}

function subscriptionCompletedTag(
  results: StripeSyncResultBreakdown,
  total: number
): CompletedSummaryTag {
  if (total === 0) return { variant: "success", label: "Nothing to sync" }
  if (results.error > 0) {
    return { variant: "warning", label: `${results.error} errors - retry` }
  }
  if (results.pending > 0) {
    return { variant: "warning", label: `${results.pending} pending - retry` }
  }
  return { variant: "success", label: "All synced" }
}

function contactCompletedTag(
  results: StripeSyncResultBreakdown,
  total: number
): CompletedSummaryTag {
  if (total === 0) return { variant: "success", label: "Nothing to sync" }
  if (results.error > 0) {
    return { variant: "warning", label: `${results.error} errors - retry` }
  }
  if (results.pending > 0) {
    return { variant: "warning", label: `${results.pending} pending - retry` }
  }
  return { variant: "success", label: "All matched" }
}

function paymentMethodCompletedTag(
  results: StripeSyncResultBreakdown,
  total: number,
  pendingFallback: number
): CompletedSummaryTag {
  if (total === 0) return { variant: "success", label: "Nothing to sync" }
  if (results.error > 0) {
    return { variant: "warning", label: `${results.error} errors - retry` }
  }
  if (results.pendingNil) {
    return { variant: "warning", label: "Pending review" }
  }
  const pending = results.pending > 0 ? results.pending : pendingFallback
  if (pending > 0) {
    return { variant: "warning", label: `${pending} pending - retry` }
  }
  return { variant: "success", label: "All synced" }
}

/** Maps a completed sync snapshot into settings-card summary rows. */
export function getCompletedSummaryRows(
  completed: StripeSyncCompleted
): CompletedSummaryRow[] {
  const { summary, results, paymentMethods } = completed

  return [
    {
      label: "Subscriptions",
      count: summary.subscriptions,
      tag: subscriptionCompletedTag(results.subscriptions, summary.subscriptions),
    },
    {
      label: "Contacts",
      count: summary.contacts,
      tag: contactCompletedTag(results.customers, summary.contacts),
    },
    {
      label: "Payment methods",
      count: summary.paymentMethods,
      tag: paymentMethodCompletedTag(
        results.paymentMethods,
        summary.paymentMethods,
        paymentMethods.pending
      ),
    },
  ]
}

/** Derives live in-progress counts from elapsed time since sync started. */
export function computeStripeSyncProgress(
  summary: StripeSyncSummaryInput,
  startedAt: number,
  now = Date.now()
): StripeSyncInProgress {
  const elapsedRatio = Math.min(
    Math.max(0, now - startedAt) / STRIPE_SYNC_COMPLETE_DELAY_MS,
    1
  )

  const subTotal = summary.subscriptions
  const contactsTotal = summary.contacts
  const pmTotal = summary.paymentMethods

  const subPendingFinal = pendingSubscriptionsAtCompletion(subTotal)
  const subSyncedFinal = Math.max(subTotal - subPendingFinal, 0)

  const contactsT = phaseProgress(elapsedRatio, 0, 0.42)
  const subscriptionsT = phaseProgress(elapsedRatio, 0.12, 0.72)
  const paymentMethodsT = phaseProgress(elapsedRatio, 0.38, 1)

  const contactsSynced = Math.round(contactsTotal * contactsT)
  const subSynced = Math.round(subSyncedFinal * subscriptionsT)
  const subPending = Math.max(subTotal - subSynced, 0)
  const pmSynced = Math.round(pmTotal * paymentMethodsT)

  return {
    status: "in-progress",
    startedAt,
    summary,
    subscriptions: {
      synced: subSynced,
      total: subTotal,
      pending: subPending,
      progressPercent:
        subTotal > 0 ? Math.round((subSynced / subTotal) * 100) : 0,
    },
    customers: {
      synced: contactsSynced,
      total: contactsTotal,
      progressPercent:
        contactsTotal > 0
          ? Math.round((contactsSynced / contactsTotal) * 100)
          : 0,
    },
    paymentMethods: {
      synced: pmSynced,
      total: pmTotal,
      errors: 0,
      progressPercent:
        pmTotal > 0 ? Math.round((pmSynced / pmTotal) * 100) : 0,
    },
  }
}

export function createStripeSyncProgress(
  summary: StripeSyncSummaryInput
): StripeSyncInProgress {
  const startedAt = Date.now()
  return computeStripeSyncProgress(summary, startedAt, startedAt)
}

export function createStripeSyncCompleted(
  from: StripeSyncInProgress
): StripeSyncCompleted {
  const { summary, startedAt } = from
  const final = computeStripeSyncProgress(
    summary,
    startedAt,
    startedAt + STRIPE_SYNC_COMPLETE_DELAY_MS
  )

  const subPending = final.subscriptions.pending
  const subSynced = Math.max(summary.subscriptions - subPending, 0)
  const pmPending = pendingPaymentMethodsAtCompletion(summary.paymentMethods)
  const pmSynced = Math.max(summary.paymentMethods - pmPending, 0)

  return {
    status: "completed",
    startedAt,
    completedAt: Date.now(),
    summary,
    subscriptions: { total: summary.subscriptions },
    customers: { total: summary.contacts },
    paymentMethods: {
      total: summary.paymentMethods,
      pending: pmPending,
    },
    results: {
      subscriptions: {
        synced: subSynced,
        pending: subPending,
        error: 0,
      },
      customers: {
        synced: summary.contacts,
        pending: 0,
        error: 0,
      },
      paymentMethods: {
        synced: pmSynced,
        pending: pmPending,
        error: 0,
        pendingNil: false,
      },
    },
  }
}

export function formatSyncTimestamp(timestamp: number): {
  date: string
  time: string
} {
  const d = new Date(timestamp)
  return {
    date: d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

export function formatLastSyncLabel(
  timestamp: number,
  now = Date.now()
): string {
  const elapsedMinutes = Math.floor((now - timestamp) / 60_000)
  if (elapsedMinutes < 1) return "Last sync just now"
  if (elapsedMinutes === 1) return "Last sync 1 min ago"
  return `Last sync ${elapsedMinutes} min ago`
}
