"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import {
  type RazorpayFormState,
} from "@/components/integrations/settings/razorpay-settings-form"
import { RazorpayBillingModelField } from "@/components/integrations/settings/razorpay/razorpay-billing-model-field"
import { RAZORPAY_WEBHOOK_URL } from "@/lib/razorpay-config-data"

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]"
    >
      {children}
      {required ? <span className="text-[#d92d20]"> *</span> : null}
    </label>
  )
}

function CredentialInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  id: string
  type?: "text" | "password"
  value: string
  onChange: (next: string) => void
  placeholder: string
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded border border-[#d0d5dd] bg-white px-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828] shadow-[0_1px_1px_rgba(16,24,40,0.05)] outline-none placeholder:text-[#667085] focus:border-[#84adff] focus:shadow-[0_0_0_4px_#eff4ff,0_1px_1px_rgba(16,24,40,0.05)]"
    />
  )
}

export function RazorpayAuthTab({
  state,
  onStateChange,
  isConnected = false,
}: {
  state: RazorpayFormState
  onStateChange: (next: RazorpayFormState) => void
  isConnected?: boolean
}) {
  const [showSecret, setShowSecret] = useState(false)
  const { keyId, secret, billing } = state

  const update = (patch: Partial<RazorpayFormState>) => {
    onStateChange({ ...state, ...patch })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-[family-name:var(--font-inter)] text-xl font-semibold leading-[30px] text-[#101828]">
          Razorpay configuration
        </h2>
        <p className="mt-2 max-w-[720px] font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
          Update test and live credentials here. Please update the webhook URL in your
          Razorpay account to{" "}
          <code className="rounded bg-[#f2f4f7] px-1 py-0.5 font-mono text-sm text-[#344054]">
            {RAZORPAY_WEBHOOK_URL}
          </code>
        </p>
      </div>

      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-x-8 gap-y-6">
        <div className="pt-1">
          <p className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Test credentials
          </p>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
            Update test credentials here.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="razorpay-manage-key-id" required>
              Razorpay key id
            </FieldLabel>
            <CredentialInput
              id="razorpay-manage-key-id"
              value={keyId}
              onChange={(next) => update({ keyId: next })}
              placeholder="Enter your Razorpay public key id"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="razorpay-manage-secret">Secret key</FieldLabel>
            <div className="relative">
              <CredentialInput
                id="razorpay-manage-secret"
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(next) => update({ secret: next })}
                placeholder="Test secret id"
              />
              <button
                type="button"
                aria-label={showSecret ? "Hide secret key" : "Show secret key"}
                onClick={() => setShowSecret((current) => !current)}
                className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-[#475467] outline-none hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
              >
                {showSecret ? (
                  <EyeOff className="size-4" strokeWidth={1.75} aria-hidden />
                ) : (
                  <Eye className="size-4" strokeWidth={1.75} aria-hidden />
                )}
              </button>
            </div>
          </div>

          <RazorpayBillingModelField
            name="razorpay-manage-billing-model"
            billing={billing}
            onBillingChange={(next) => update({ billing: next })}
            confirmOnChange={isConnected}
          />
        </div>
      </div>
    </div>
  )
}
