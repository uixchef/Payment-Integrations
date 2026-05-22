"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, Info } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { ConnectionStatusTag } from "@/components/integrations/settings/integration-settings-fields"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

export type RazorpayMode = "live" | "test"
export type RazorpayBillingModel = "fixed" | "on-demand"

function ModeSwitcher({
  value,
  onChange,
}: {
  value: RazorpayMode
  onChange: (mode: RazorpayMode) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Environment"
      className="inline-flex h-9 shrink-0 overflow-hidden rounded border border-[#d0d5dd] bg-white shadow-[0_1px_1px_rgba(16,24,40,0.05)]"
    >
      {(["live", "test"] as const).map((mode) => {
        const active = value === mode
        return (
          <button
            key={mode}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(mode)}
            className={cn(
              "inline-flex h-full items-center justify-center px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 capitalize outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-[#84adff]",
              active
                ? "bg-[#eff4ff] text-[#004eeb]"
                : "bg-white text-[#344054] hover:bg-[#f9fafb]"
            )}
          >
            {mode}
          </button>
        )
      })}
    </div>
  )
}

function FormLabel({
  htmlFor,
  required,
  children,
  trailing,
}: {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]"
    >
      <span>{children}</span>
      {required ? <span className="text-[#d92d20]">*</span> : null}
      {trailing}
    </label>
  )
}

function TextInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  trailing,
  ariaLabel,
  readOnly = false,
}: {
  id: string
  type?: "text" | "password"
  value: string
  onChange: (next: string) => void
  placeholder: string
  trailing: React.ReactNode
  ariaLabel?: string
  readOnly?: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-full shrink-0 isolate items-stretch rounded shadow-[0_1px_1px_rgba(16,24,40,0.05)]",
        !readOnly &&
          "focus-within:shadow-[0_0_0_4px_#eff4ff,0_1px_1px_rgba(16,24,40,0.05)]"
      )}
    >
      <div
        className={cn(
          "relative z-[2] flex h-full min-w-0 flex-1 items-center rounded-l border border-r-0 border-[#d0d5dd] px-2",
          readOnly
            ? "bg-[#f9fafb]"
            : "bg-white focus-within:border-[#84adff]"
        )}
      >
        <input
          id={id}
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-[family-name:var(--font-inter)] text-base leading-6 placeholder:text-[#667085] outline-none",
            readOnly
              ? "cursor-default text-[#98a2b3]"
              : "text-[#101828]"
          )}
        />
      </div>
      <div
        className={cn(
          "relative z-[1] flex h-full shrink-0 items-stretch rounded-r border bg-white",
          readOnly
            ? "border-[#d0d5dd] shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
            : "border-[#eaecf0]"
        )}
      >
        {trailing}
      </div>
    </div>
  )
}

function TrailingIconButton({
  ariaLabel,
  onClick,
  disabled = false,
  children,
}: {
  ariaLabel: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-full items-center justify-center rounded-r px-2 outline-none transition-colors",
        disabled
          ? "cursor-not-allowed text-[#98a2b3]"
          : "cursor-pointer text-[#475467] hover:bg-[#f2f4f7] focus-visible:bg-[#f2f4f7]"
      )}
    >
      {children}
    </button>
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

export type RazorpayFormState = {
  mode: RazorpayMode
  keyId: string
  secret: string
  billing: RazorpayBillingModel
}

export type RazorpayFormProps = {
  isConnected: boolean
  isDefault?: boolean
  state: RazorpayFormState
  onStateChange: (next: RazorpayFormState) => void
}

export function RazorpaySettingsForm({
  isConnected,
  isDefault = false,
  state,
  onStateChange,
}: RazorpayFormProps) {
  const { mode, keyId, secret, billing } = state
  const [showSecret, setShowSecret] = useState(false)
  const [pendingBilling, setPendingBilling] =
    useState<RazorpayBillingModel | null>(null)

  const update = (patch: Partial<RazorpayFormState>) => {
    onStateChange({ ...state, ...patch })
  }

  const handleCopyKeyId = async () => {
    if (!keyId || typeof navigator === "undefined") return
    try {
      await navigator.clipboard.writeText(keyId)
    } catch {
      // ignored — clipboard unavailable
    }
  }

  const handleBillingChange = (next: RazorpayBillingModel) => {
    if (next === billing) return
    if (isConnected) {
      setPendingBilling(next)
      return
    }
    update({ billing: next })
  }

  const confirmBillingChange = () => {
    if (pendingBilling) {
      update({ billing: pendingBilling })
    }
    setPendingBilling(null)
  }

  return (
    <form
      className="flex w-full max-w-[656px] flex-col"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Razorpay configuration
          </h2>
          <ConnectionStatusTag isConnected={isConnected} isDefault={isDefault} />
        </div>
        <ModeSwitcher
          value={mode}
          onChange={(next) => update({ mode: next })}
        />
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <div className="flex flex-col gap-1">
          <FormLabel htmlFor="razorpay-key-id" required>
            Razorpay key id
          </FormLabel>
          <TextInput
            id="razorpay-key-id"
            value={keyId}
            onChange={(next) => update({ keyId: next })}
            placeholder="Enter your Razorpay public key id"
            readOnly={isConnected}
            trailing={
              <TrailingIconButton
                ariaLabel="Copy Razorpay key id"
                onClick={handleCopyKeyId}
                disabled={keyId.length === 0}
              >
                <Copy className="size-5" strokeWidth={1.75} aria-hidden />
              </TrailingIconButton>
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <FormLabel htmlFor="razorpay-secret">Secret key</FormLabel>
          <TextInput
            id="razorpay-secret"
            type={showSecret ? "text" : "password"}
            value={secret}
            onChange={(next) => update({ secret: next })}
            placeholder={mode === "live" ? "Live secret id" : "Test secret id"}
            readOnly={isConnected}
            trailing={
              <TrailingIconButton
                ariaLabel={showSecret ? "Hide secret key" : "Show secret key"}
                onClick={() => setShowSecret((current) => !current)}
                disabled={secret.length === 0}
              >
                {showSecret ? (
                  <EyeOff className="size-5" strokeWidth={1.75} aria-hidden />
                ) : (
                  <Eye className="size-5" strokeWidth={1.75} aria-hidden />
                )}
              </TrailingIconButton>
            }
          />
        </div>

        <fieldset className="flex flex-col gap-1">
          <legend className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
            Billing model
            <BillingModelTooltip />
          </legend>
          <div className="flex items-center gap-3">
            <RadioOption
              name="billing-model"
              value="fixed"
              current={billing}
              onChange={handleBillingChange}
              label="Fixed schedule"
            />
            <RadioOption
              name="billing-model"
              value="on-demand"
              current={billing}
              onChange={handleBillingChange}
              label="Charge when needed"
            />
          </div>
        </fieldset>
      </div>

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
    </form>
  )
}
