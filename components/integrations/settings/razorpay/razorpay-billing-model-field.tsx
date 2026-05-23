"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { RazorpayBillingModel } from "@/components/integrations/settings/razorpay-settings-form"
import { cn } from "@/lib/utils"

const BILLING_MODEL_DOCS_HREF =
  "https://help.gohighlevel.com/support/solutions/articles/48000980323-razorpay-integration"

function BillingModelTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="About billing models"
          className="flex size-3 items-center justify-center rounded-full text-[#98a2b3] outline-none transition-colors hover:text-[#475467] focus-visible:ring-2 focus-visible:ring-[#84adff]"
        >
          <Info className="size-3" strokeWidth={1.75} aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-[240px] p-2">
        <span>Choose how subscription are billed for this provider. </span>
        <a
          href={BILLING_MODEL_DOCS_HREF}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-white underline underline-offset-2 hover:text-[#eaecf0]"
        >
          Know more
        </a>
      </TooltipContent>
    </Tooltip>
  )
}

function RadioOption({
  name,
  value,
  current,
  onChange,
  label,
  disabled,
}: {
  name: string
  value: RazorpayBillingModel
  current: RazorpayBillingModel
  onChange: (next: RazorpayBillingModel) => void
  label: string
  disabled?: boolean
}) {
  const checked = current === value

  return (
    <label
      className={cn(
        "flex h-9 items-center gap-1 font-[family-name:var(--font-inter)] text-base font-normal leading-6 text-[#101828]",
        disabled ? "cursor-default" : "cursor-pointer"
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          checked
            ? "border-[#155eef] bg-[#155eef]"
            : cn(
                "border-[#98a2b3] bg-white",
                !disabled && "peer-hover:border-[#155eef]"
              )
        )}
      >
        {checked ? (
          <span className="block size-1.5 rounded-full bg-white" />
        ) : null}
      </span>
      <span>{label}</span>
    </label>
  )
}

export function RazorpayBillingModelField({
  name = "billing-model",
  billing,
  onBillingChange,
  confirmOnChange = false,
  disabled = false,
}: {
  name?: string
  billing: RazorpayBillingModel
  onBillingChange: (next: RazorpayBillingModel) => void
  confirmOnChange?: boolean
  disabled?: boolean
}) {
  const [pendingBilling, setPendingBilling] =
    useState<RazorpayBillingModel | null>(null)

  const handleBillingChange = (next: RazorpayBillingModel) => {
    if (next === billing) return
    if (confirmOnChange) {
      setPendingBilling(next)
      return
    }
    onBillingChange(next)
  }

  const confirmBillingChange = () => {
    if (pendingBilling) {
      onBillingChange(pendingBilling)
    }
    setPendingBilling(null)
  }

  return (
    <>
      <fieldset className="flex flex-col gap-1">
        <legend className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          Billing model
          <BillingModelTooltip />
        </legend>
        <div className="flex items-center gap-3">
          <RadioOption
            name={name}
            value="fixed"
            current={billing}
            onChange={handleBillingChange}
            label="Fixed schedule"
            disabled={disabled}
          />
          <RadioOption
            name={name}
            value="on-demand"
            current={billing}
            onChange={handleBillingChange}
            label="Charge when needed"
            disabled={disabled}
          />
        </div>
      </fieldset>

      <ConfirmationDialog
        open={pendingBilling !== null}
        onOpenChange={(open) => {
          if (!open) setPendingBilling(null)
        }}
        title="Switch billing model?"
        description="Changing the billing model affects how future charges are processed for this account. Existing subscriptions may behave differently after the switch."
        confirmLabel="Switch model"
        variant="warning"
        onConfirm={confirmBillingChange}
      />
    </>
  )
}
