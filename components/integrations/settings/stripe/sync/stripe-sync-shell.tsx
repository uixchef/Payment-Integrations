"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Separator } from "@/components/ui/separator"
import { useStripeAccounts } from "@/components/integrations/settings/stripe/stripe-accounts-context"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"
import {
  StepConfirmImport,
  type AutomationBehavior,
  type ConfirmSummary,
} from "./step-confirm-import"
import {
  StepReviewSelect,
  type ReviewSelections,
  type ReviewTab,
} from "./step-review-select"
import { StepScanConfigure, type ScanConfig } from "./step-scan-configure"
import { ResultsFooter, StepSyncResults } from "./step-sync-results"
import { STRIPE_SYNC_COUNTS } from "./sync-mock-data"
import { StripeSyncImportingModal } from "./stripe-sync-importing-modal"
import { StripeSyncStepper } from "./stripe-sync-stepper"

type WizardStep = 1 | 2 | 3 | 4

export function StripeSyncShell({ item }: { item: IntegrationItem }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    activeAccountId,
    startAccountSync,
    getAccountSyncState,
    saveIncompleteSync,
    clearAccountSync,
  } = useStripeAccounts()
  const logo = item.logo ?? INTEGRATION_ASSETS.logos.stripe

  const [currentStep, setCurrentStep] = useState<WizardStep>(1)

  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    importSubscriptions: true,
    contactPaymentMethodSync: true,
  })

  const [activeReviewTab, setActiveReviewTab] = useState<ReviewTab>("contacts")
  const [reviewSelections, setReviewSelections] = useState<ReviewSelections>({
    contacts: new Set<string>(),
    subscriptions: new Set<string>(),
  })
  const [reviewSearch, setReviewSearch] = useState("")

  const [automationBehavior, setAutomationBehavior] =
    useState<AutomationBehavior>("no-trigger")

  const [importingOpen, setImportingOpen] = useState(false)
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)

  const accountSyncState = getAccountSyncState(activeAccountId)
  const isResultsView =
    currentStep === 4 &&
    accountSyncState?.status === "completed" &&
    searchParams.get("view") === "results"

  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "importing") {
      setCurrentStep(4)
      setImportingOpen(true)
      return
    }
    if (view === "results") {
      setCurrentStep(4)
      setImportingOpen(false)
    }
  }, [searchParams])

  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "importing" || view === "results") return

    const incomplete = accountSyncState
    if (incomplete?.status !== "incomplete") return

    const { draft } = incomplete
    setCurrentStep(draft.currentStep)
    setScanConfig(draft.scanConfig)
    setActiveReviewTab(draft.activeReviewTab)
    setReviewSelections({
      contacts: new Set(draft.reviewSelections.contacts),
      subscriptions: new Set(draft.reviewSelections.subscriptions),
    })
    setReviewSearch(draft.reviewSearch)
    setAutomationBehavior(draft.automationBehavior)
  }, [accountSyncState, searchParams])

  const summary: ConfirmSummary = {
    subscriptions:
      reviewSelections.subscriptions.size || STRIPE_SYNC_COUNTS.subscriptions,
    contacts:
      reviewSelections.contacts.size || STRIPE_SYNC_COUNTS.contacts,
    paymentMethods: STRIPE_SYNC_COUNTS.notEligible,
  }

  const modalSummary =
    accountSyncState && accountSyncState.status !== "incomplete"
      ? accountSyncState.summary
      : {
          subscriptions: summary.subscriptions,
          contacts: summary.contacts,
          paymentMethods: summary.paymentMethods,
        }

  const canContinue =
    currentStep === 1
      ? scanConfig.importSubscriptions || scanConfig.contactPaymentMethodSync
      : true

  const handleContinue = () => {
    if (currentStep === 3) {
      if (activeAccountId) {
        startAccountSync(activeAccountId, summary)
      }
      setCurrentStep(4)
      setImportingOpen(true)
      return
    }
    setCurrentStep((s) => (s + 1) as WizardStep)
  }

  const handleImportModalClose = (open: boolean) => {
    if (!open) {
      router.push("/integrations/stripe")
    }
    setImportingOpen(open)
  }

  const handleResync = () => {
    if (activeAccountId) clearAccountSync(activeAccountId)
    router.push("/integrations/stripe/sync")
  }

  const goToPreviousStep = () => {
    if (currentStep === 1) {
      router.push("/integrations/stripe")
      return
    }
    setCurrentStep((s) => (s - 1) as WizardStep)
  }

  const handlePrevious = () => {
    if (currentStep === 3) {
      setLeaveConfirmOpen(true)
      return
    }
    goToPreviousStep()
  }

  const handleBack = () => {
    if (currentStep === 3) {
      setLeaveConfirmOpen(true)
      return
    }
    if (currentStep === 1) {
      router.push("/integrations/stripe")
      return
    }
    history.back()
  }

  const handleDiscardStepChanges = () => {
    if (activeAccountId) {
      clearAccountSync(activeAccountId)
    }
    router.push("/integrations/stripe")
  }

  const handleSaveStepChanges = () => {
    if (!activeAccountId) return

    saveIncompleteSync(activeAccountId, {
      currentStep: 3,
      scanConfig,
      activeReviewTab,
      reviewSelections: {
        contacts: [...reviewSelections.contacts],
        subscriptions: [...reviewSelections.subscriptions],
      },
      reviewSearch,
      automationBehavior,
    })
    router.push("/integrations/stripe")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SubHeader logo={logo} onBack={handleBack} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-hidden p-6">
            <div className="flex min-h-0 w-full flex-1 gap-10">
              <StripeSyncStepper currentStep={currentStep} />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
                {currentStep === 1 ? (
                  <StepScanConfigure
                    config={scanConfig}
                    onChange={setScanConfig}
                  />
                ) : currentStep === 2 ? (
                  <StepReviewSelect
                    activeTab={activeReviewTab}
                    onTabChange={setActiveReviewTab}
                    selections={reviewSelections}
                    onSelectionsChange={setReviewSelections}
                    searchQuery={reviewSearch}
                    onSearchChange={setReviewSearch}
                  />
                ) : isResultsView && accountSyncState?.status === "completed" ? (
                  <StepSyncResults completed={accountSyncState} />
                ) : currentStep === 3 || currentStep === 4 ? (
                  <StepConfirmImport
                    summary={summary}
                    behavior={automationBehavior}
                    onBehaviorChange={setAutomationBehavior}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {isResultsView ? (
            <ResultsFooter
              onResync={handleResync}
              onGoToSubscriptions={() => {
                /* mock: navigate to subscriptions */
              }}
              onDone={() => router.push("/integrations/stripe")}
            />
          ) : (
            <Footer
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === 3}
              continueDisabled={importingOpen}
              canContinue={canContinue}
              onPrevious={handlePrevious}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>

      <StripeSyncImportingModal
        open={importingOpen}
        onOpenChange={handleImportModalClose}
        logo={logo}
        summary={modalSummary}
      />

      <ConfirmationDialog
        open={leaveConfirmOpen}
        onOpenChange={setLeaveConfirmOpen}
        title="Unsaved changes?"
        description="You have unsaved changes. Save them before turning off Stripe syncing, or discard them to continue without saving."
        confirmLabel="Save changes"
        cancelLabel="Discard"
        variant="warning"
        footerLayout="split"
        cancelVariant="warning-outline"
        onConfirm={handleSaveStepChanges}
        onCancel={handleDiscardStepChanges}
      />
    </div>
  )
}

function SubHeader({
  logo,
  onBack,
}: {
  logo: string
  onBack: () => void
}) {
  return (
    <header className="flex h-[62px] shrink-0 items-center gap-3 border-b border-[#d0d5dd] bg-white px-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to Stripe settings"
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px]">
        <Image
          src={logo}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="size-10 object-contain"
          aria-hidden
        />
      </span>
      <div className="flex min-w-0 flex-col">
        <h1 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          Stripe sync
        </h1>
        <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
          Import existing subscriptions, contacts, and saved payment references
          from your connected Stripe account.
        </p>
      </div>
    </header>
  )
}

function Footer({
  isFirstStep,
  isLastStep,
  continueDisabled,
  canContinue,
  onPrevious,
  onContinue,
}: {
  isFirstStep: boolean
  isLastStep: boolean
  continueDisabled?: boolean
  canContinue: boolean
  onPrevious: () => void
  onContinue: () => void
}) {
  return (
    <footer className="flex shrink-0 flex-col">
      <Separator className="bg-[#eaecf0]" />
      <div className="flex items-center justify-between px-6 py-3">
        <Button
          type="button"
          variant="neutral"
          onClick={onPrevious}
          className={cn(
            "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
            isFirstStep ? "invisible" : ""
          )}
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || continueDisabled}
          className={cn(
            "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
            canContinue
              ? "bg-[#155eef] hover:bg-[#004eeb]"
              : "cursor-not-allowed bg-[#b2ccff]"
          )}
        >
          {isLastStep ? "Start import" : "Continue"}
        </Button>
      </div>
    </footer>
  )
}
