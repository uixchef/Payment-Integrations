import type { AutomationBehavior } from "./step-confirm-import"
import type { ReviewTab } from "./step-review-select"
import type { ScanConfig } from "./step-scan-configure"

export type StripeSyncWizardStep = 1 | 2 | 3

export type StripeSyncDraft = {
  currentStep: StripeSyncWizardStep
  scanConfig: ScanConfig
  activeReviewTab: ReviewTab
  reviewSelections: {
    contacts: string[]
    subscriptions: string[]
  }
  reviewSearch: string
  automationBehavior: AutomationBehavior
}

export type StripeSyncIncomplete = {
  status: "incomplete"
  savedAt: number
  draft: StripeSyncDraft
}

export function createStripeSyncIncomplete(
  draft: StripeSyncDraft
): StripeSyncIncomplete {
  return {
    status: "incomplete",
    savedAt: Date.now(),
    draft,
  }
}
