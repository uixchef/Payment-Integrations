"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { ManualPaymentConfigForm } from "@/components/integrations/settings/manual-payment/manual-payment-config-form"
import { ManualPaymentEmptyState } from "@/components/integrations/settings/manual-payment/manual-payment-empty-state"
import { ManualPaymentGuide } from "@/components/integrations/settings/manual-payment/manual-payment-guide"
import {
  MANUAL_PAYMENT_EMPTY,
  MANUAL_PAYMENT_TABS,
  canSaveManualMethod,
  createInitialMethodState,
  getTabMeta,
  methodFormKey,
  type ManualPaymentMethodForm,
  type ManualPaymentMethodState,
  type ManualPaymentTab,
} from "@/lib/manual-payment-data"
import { cn } from "@/lib/utils"

function ManualPaymentSubHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: ManualPaymentTab
  onTabChange: (tab: ManualPaymentTab) => void
}) {
  return (
    <header className="flex h-[62px] shrink-0 items-center gap-3 border-b border-[#d0d5dd] bg-white px-4">
      <Link
        href="/integrations"
        aria-label="Back to integrations"
        className="flex size-6 shrink-0 items-center justify-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
          <Image
            src={INTEGRATION_ASSETS.logos.manual}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-6 object-contain"
            aria-hidden
          />
        </span>
        <h1 className="whitespace-nowrap font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          Manual payment method integration settings
        </h1>
      </div>

      <nav
        aria-label="Manual payment methods"
        className="flex min-w-0 flex-1 items-stretch gap-0 self-stretch overflow-hidden"
      >
        {MANUAL_PAYMENT_TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex shrink-0 items-center border-b-2 px-2 font-[family-name:var(--font-inter)] text-base leading-6 outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#84adff]",
                active
                  ? "border-[#004eeb] font-semibold text-[#004eeb]"
                  : "border-transparent font-medium text-[#475467] hover:text-[#101828]"
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}

function ManualPaymentFooter({
  mode,
  saveDisabled,
  onCancel,
  onSave,
  onRemove,
}: {
  mode: "configuring" | "enabled"
  saveDisabled: boolean
  onCancel: () => void
  onSave: () => void
  onRemove: () => void
}) {
  return (
    <footer className="flex flex-col gap-3 pt-0">
      <Separator className="bg-[#eaecf0]" />
      <div className="flex items-center justify-end gap-2 px-6 pb-3">
        {mode === "configuring" ? (
          <>
            <Button type="button" variant="neutral" onClick={onCancel} className="px-2.5">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saveDisabled}
              onClick={onSave}
              className={cn(
                "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
                "bg-[#155eef] hover:bg-[#004eeb]",
                "disabled:bg-[#b2ccff] disabled:text-white disabled:opacity-100"
              )}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="neutral" onClick={onRemove} className="px-2.5">
              Remove
            </Button>
            <Button
              type="button"
              disabled={saveDisabled}
              onClick={onSave}
              className={cn(
                "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
                "bg-[#155eef] hover:bg-[#004eeb]",
                "disabled:bg-[#b2ccff] disabled:text-white disabled:opacity-100"
              )}
            >
              Save
            </Button>
          </>
        )}
      </div>
    </footer>
  )
}

function extractForm(state: ManualPaymentMethodState): ManualPaymentMethodForm {
  const { name, paymentInstructions, message, enableFor } = state
  return { name, paymentInstructions, message, enableFor }
}

export function ManualPaymentSettingsShell() {
  const [activeTab, setActiveTab] = useState<ManualPaymentTab>("cash-on-delivery")
  const [methods, setMethods] = useState<
    Record<ManualPaymentTab, ManualPaymentMethodState>
  >({
    "cash-on-delivery": createInitialMethodState("cash-on-delivery"),
    "custom-payment": createInitialMethodState("custom-payment"),
  })
  const [savedSnapshots, setSavedSnapshots] = useState<
    Record<ManualPaymentTab, string | null>
  >({
    "cash-on-delivery": null,
    "custom-payment": null,
  })

  const currentMethod = methods[activeTab]
  const tabMeta = getTabMeta(activeTab)
  const currentForm = extractForm(currentMethod)
  const savedKey = savedSnapshots[activeTab]
  const isDirty = savedKey !== null && methodFormKey(currentForm) !== savedKey
  const isEnabled = currentMethod.status === "enabled"
  const isConfiguring = currentMethod.status === "configuring"
  const showForm = isConfiguring || isEnabled

  const saveDisabled = useMemo(() => {
    if (!canSaveManualMethod(activeTab, currentForm)) return true
    if (isEnabled) return !isDirty
    return false
  }, [activeTab, currentForm, isDirty, isEnabled])

  const updateMethod = (next: Partial<ManualPaymentMethodState>) => {
    setMethods((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...next },
    }))
  }

  const handleEnable = () => {
    updateMethod({ status: "configuring" })
  }

  const handleCancel = () => {
    if (savedKey === null) {
      setMethods((prev) => ({
        ...prev,
        [activeTab]: createInitialMethodState(activeTab),
      }))
      return
    }

    const saved = JSON.parse(savedKey) as ManualPaymentMethodForm
    setMethods((prev) => ({
      ...prev,
      [activeTab]: { ...saved, status: "enabled" },
    }))
  }

  const handleSave = () => {
    if (saveDisabled) return
    const snapshot = methodFormKey(currentForm)
    setSavedSnapshots((prev) => ({ ...prev, [activeTab]: snapshot }))
    updateMethod({ status: "enabled" })
  }

  const handleRemove = () => {
    setSavedSnapshots((prev) => ({ ...prev, [activeTab]: null }))
    setMethods((prev) => ({
      ...prev,
      [activeTab]: createInitialMethodState(activeTab),
    }))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ManualPaymentSubHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
            {showForm ? (
              <div className="mx-auto flex w-full max-w-[1080px] items-start gap-10">
                <div className="flex w-full max-w-[640px] min-w-0 flex-1">
                  <ManualPaymentConfigForm
                    tabMeta={tabMeta}
                    form={currentForm}
                    isEnabled={isEnabled}
                    onChange={(form) => updateMethod(form)}
                  />
                </div>
                <ManualPaymentGuide tab={activeTab} isEnabled={isEnabled} />
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-[640px] flex-col items-center">
                <ManualPaymentEmptyState
                  content={MANUAL_PAYMENT_EMPTY[activeTab]}
                  onEnable={handleEnable}
                />
              </div>
            )}
          </div>

          {showForm ? (
            <ManualPaymentFooter
              mode={isEnabled ? "enabled" : "configuring"}
              saveDisabled={saveDisabled}
              onCancel={handleCancel}
              onSave={handleSave}
              onRemove={handleRemove}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
