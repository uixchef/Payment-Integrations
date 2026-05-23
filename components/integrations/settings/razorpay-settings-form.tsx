"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff } from "lucide-react"
import { ConnectionStatusTag } from "@/components/integrations/settings/integration-settings-fields"
import { RazorpayBillingModelField } from "@/components/integrations/settings/razorpay/razorpay-billing-model-field"
import { cn } from "@/lib/utils"

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
    update({ billing: next })
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

        <RazorpayBillingModelField
          billing={billing}
          onBillingChange={handleBillingChange}
          confirmOnChange={isConnected}
        />
      </div>
    </form>
  )
}
