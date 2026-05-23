"use client"

import { useState } from "react"
import { ExternalLink, Eye, EyeOff } from "lucide-react"
import {
  ConnectionStatusTag,
  ModeSwitcher,
  SettingsFormLabel,
  envPlaceholder,
  type IntegrationEnvironment,
} from "@/components/integrations/settings/integration-settings-fields"
import { cn } from "@/lib/utils"

export type PayPalAccount = {
  id: string
  label: string
  connected: boolean
  clientId: string
  secretId: string
  merchantId: string
  mode: IntegrationEnvironment
}

type PayPalAccountConfigProps = {
  account: PayPalAccount
  isDefaultAccount: boolean
  onModeChange: (mode: IntegrationEnvironment) => void
  onClientIdChange: (clientId: string) => void
  onSecretIdChange: (secretId: string) => void
}

export function PayPalAccountConfig({
  account,
  isDefaultAccount,
  onModeChange,
  onClientIdChange,
  onSecretIdChange,
}: PayPalAccountConfigProps) {
  const [showSecret, setShowSecret] = useState(false)
  const readOnly = account.connected

  return (
    <div className="flex w-full max-w-[656px] flex-col">
      <div className="flex items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            {account.label} configuration
          </h2>
          {!isDefaultAccount ? (
            <ConnectionStatusTag
              isConnected={account.connected}
              isDefault={false}
            />
          ) : null}
        </div>
        <ModeSwitcher value={account.mode} onChange={onModeChange} />
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor={`${account.id}-client-id`}>
            Client id
          </SettingsFormLabel>
          <CredentialInput
            id={`${account.id}-client-id`}
            value={account.clientId}
            onChange={onClientIdChange}
            placeholder={envPlaceholder(account.mode, "client id")}
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor={`${account.id}-secret-id`}>
            Secret id
          </SettingsFormLabel>
          <CredentialInput
            id={`${account.id}-secret-id`}
            type={showSecret ? "text" : "password"}
            value={account.secretId}
            onChange={onSecretIdChange}
            placeholder={envPlaceholder(account.mode, "secret id")}
            readOnly={readOnly}
            trailing={
              <TrailingIconButton
                ariaLabel={showSecret ? "Hide secret id" : "Show secret id"}
                onClick={() => setShowSecret((current) => !current)}
                disabled={account.secretId.length === 0}
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

        {account.connected ? (
          <div className="flex flex-col gap-1">
            <SettingsFormLabel htmlFor={`${account.id}-merchant-id`}>
              Merchant id
            </SettingsFormLabel>
            <CredentialInput
              id={`${account.id}-merchant-id`}
              value={account.merchantId}
              onChange={() => {}}
              placeholder=""
              readOnly
              trailing={
                <TrailingIconButton
                  ariaLabel="Open merchant in PayPal"
                  onClick={() => {
                    window.open(
                      "https://www.paypal.com/businessprofile/settings/",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }}
                  disabled={account.merchantId.length === 0}
                >
                  <ExternalLink
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </TrailingIconButton>
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function CredentialInput({
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
  trailing?: React.ReactNode
}) {
  if (!trailing) {
    return (
      <div
        className={cn(
          "flex h-9 w-full items-center rounded border border-[#d0d5dd] px-2 shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
          !readOnly &&
            "bg-white focus-within:border-[#84adff] focus-within:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]",
          readOnly && "bg-[#f9fafb]"
        )}
      >
        <input
          id={id}
          type={readOnly ? "text" : type}
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-[family-name:var(--font-inter)] text-base leading-6 outline-none placeholder:text-[#667085]",
            readOnly ? "cursor-default text-[#98a2b3]" : "text-[#101828]"
          )}
        />
      </div>
    )
  }

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
          type={readOnly ? "text" : type}
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-[family-name:var(--font-inter)] text-base leading-6 outline-none placeholder:text-[#667085]",
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
