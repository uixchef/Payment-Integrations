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

export function createStripeSyncProgress(
  summary: StripeSyncSummaryInput
): StripeSyncInProgress {
  const subPending =
    summary.subscriptions > 0
      ? Math.min(2, Math.max(1, Math.round(summary.subscriptions * 0.04)))
      : 0
  const subSynced = Math.max(summary.subscriptions - subPending, 0)
  const subProgress =
    summary.subscriptions > 0
      ? Math.round((subSynced / summary.subscriptions) * 100)
      : 0

  const pmSynced =
    summary.paymentMethods > 0
      ? Math.max(1, Math.round(summary.paymentMethods * 0.3))
      : 0
  const pmProgress =
    summary.paymentMethods > 0
      ? Math.round((pmSynced / summary.paymentMethods) * 100)
      : 0

  return {
    status: "in-progress",
    startedAt: Date.now(),
    summary,
    subscriptions: {
      synced: subSynced,
      total: summary.subscriptions,
      pending: subPending,
      progressPercent: subProgress,
    },
    customers: {
      synced: summary.contacts,
      total: summary.contacts,
      progressPercent: summary.contacts > 0 ? 80 : 0,
    },
    paymentMethods: {
      synced: pmSynced,
      total: summary.paymentMethods,
      errors: 0,
      progressPercent: pmProgress,
    },
  }
}

export function createStripeSyncCompleted(
  from: StripeSyncInProgress
): StripeSyncCompleted {
  const subPending = from.subscriptions.pending
  const paymentPending =
    from.summary.paymentMethods > 0
      ? Math.min(2, Math.max(1, Math.round(from.summary.paymentMethods * 0.17)))
      : 0

  return {
    status: "completed",
    startedAt: from.startedAt,
    completedAt: Date.now(),
    summary: from.summary,
    subscriptions: { total: from.summary.subscriptions },
    customers: { total: from.summary.contacts },
    paymentMethods: {
      total: from.summary.paymentMethods,
      pending: paymentPending,
    },
    results: {
      subscriptions: {
        synced: from.summary.subscriptions,
        pending: subPending,
        error: 0,
      },
      customers: {
        synced: from.summary.contacts,
        pending: 0,
        error: 0,
      },
      paymentMethods: {
        synced: from.summary.paymentMethods,
        pending: 0,
        error: 0,
        pendingNil: from.summary.paymentMethods > 0,
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
