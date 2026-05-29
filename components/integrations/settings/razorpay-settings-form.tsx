"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff } from "lucide-react"
import {
  SettingsCard,
  SettingsCardDivider,
} from "@/components/integrations/settings/account-settings-card"
import {
  ConnectionStatusTag,
  ModeSwitcher,
  SettingsFormLabel,
  type IntegrationEnvironment,
} from "@/components/integrations/settings/integration-settings-fields"
import { RazorpayBillingModelField } from "@/components/integrations/settings/razorpay/razorpay-billing-model-field"
import { cn } from "@/lib/utils"

export type RazorpayBillingModel = "fixed" | "on-demand"

export type RazorpayFormState = {
  mode: IntegrationEnvironment
  keyId: string
  secret: string
  billing: RazorpayBillingModel
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

function InputWithTrailing({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
  trailing,
}: {
  id: string
  type?: "text" | "password"
  value: string
  onChange: (next: string) => void
  placeholder: string
  readOnly?: boolean
  trailing: React.ReactNode
}) {
  const inputType = readOnly ? "text" : type

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
          type={inputType}
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-[family-name:var(--font-inter)] text-base leading-6 placeholder:text-[#667085] outline-none",
            readOnly ? "cursor-default text-[#98a2b3]" : "text-[#101828]"
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
  const readOnly = isConnected

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

  return (
    <SettingsCard className="max-w-[756px]">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Razorpay configuration
          </h2>
          <ConnectionStatusTag isConnected={isConnected} isDefault={isDefault} />
        </div>
        <ModeSwitcher value={mode} onChange={(next) => update({ mode: next })} />
      </div>

      <SettingsCardDivider />

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="razorpay-key-id" required>
            Razorpay key id
          </SettingsFormLabel>
          <InputWithTrailing
            id="razorpay-key-id"
            value={keyId}
            onChange={(next) => update({ keyId: next })}
            placeholder="Enter your Razorpay public key id"
            readOnly={readOnly}
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
          <SettingsFormLabel htmlFor="razorpay-secret">Secret key</SettingsFormLabel>
          <InputWithTrailing
            id="razorpay-secret"
            type={showSecret ? "text" : "password"}
            value={secret}
            onChange={(next) => update({ secret: next })}
            placeholder={mode === "live" ? "Live secret id" : "Test secret id"}
            readOnly={readOnly}
            trailing={
              <TrailingIconButton
                ariaLabel={showSecret ? "Hide secret key" : "Show secret key"}
                onClick={() => setShowSecret((current) => !current)}
                disabled={readOnly || secret.length === 0}
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
          onBillingChange={(next) => update({ billing: next })}
          confirmOnChange={isConnected}
        />
      </div>
    </SettingsCard>
  )
}
