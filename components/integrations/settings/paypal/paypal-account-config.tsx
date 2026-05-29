"use client"

import { useState } from "react"
import {
  Banknote,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  RefreshCw,
  Settings2,
  Star,
  UserRound,
} from "lucide-react"
import {
  SettingsActionRow,
  SettingsCard,
  SettingsCardDivider,
  SettingsCardTitle,
  SettingsPrimaryActionRow,
  SettingsToggleRow,
} from "@/components/integrations/settings/account-settings-card"
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
  oauthConnected: boolean
  /** Pending account uses OAuth empty state instead of credential fields. */
  oauthFlow: boolean
  clientId: string
  secretId: string
  merchantId: string
  name: string
  email: string
  totalBalance: string
  mode: IntegrationEnvironment
}

type PayPalAccountConfigProps = {
  account: PayPalAccount
  isDefaultAccount: boolean
  setAsDefaultChecked: boolean
  setAsDefaultDisabled: boolean
  setAsDefaultTooltip?: string
  disconnectDisabled: boolean
  disconnectTooltip?: string
  disconnectDescription: string
  onModeChange: (mode: IntegrationEnvironment) => void
  onClientIdChange: (clientId: string) => void
  onSecretIdChange: (secretId: string) => void
  onSetAsDefaultChange: (checked: boolean) => void
  onOpenPaymentMethods: () => void
  onReconnect: () => void
  onEditAccount: () => void
  onDisconnect: () => void
}

export function PayPalAccountConfig({
  account,
  isDefaultAccount,
  setAsDefaultChecked,
  setAsDefaultDisabled,
  setAsDefaultTooltip,
  disconnectDisabled,
  disconnectTooltip,
  disconnectDescription,
  onModeChange,
  onClientIdChange,
  onSecretIdChange,
  onSetAsDefaultChange,
  onOpenPaymentMethods,
  onReconnect,
  onEditAccount,
  onDisconnect,
}: PayPalAccountConfigProps) {
  const showOAuthView = account.connected && account.oauthConnected
  const showLegacyReconnect =
    account.connected && !account.oauthConnected

  const configurationCard = showOAuthView ? (
    <OAuthConfigurationCard
      account={account}
      isDefaultAccount={isDefaultAccount}
      onEditAccount={onEditAccount}
      onModeChange={onModeChange}
    />
  ) : (
    <CredentialConfigurationCard
      account={account}
      isDefaultAccount={isDefaultAccount}
      onEditAccount={onEditAccount}
      onModeChange={onModeChange}
      onClientIdChange={onClientIdChange}
      onSecretIdChange={onSecretIdChange}
    />
  )

  if (!account.connected) {
    return (
      <div className="flex w-full max-w-[756px] flex-col">
        {configurationCard}
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-[756px] flex-col gap-6">
      {configurationCard}

      <SettingsCard>
        <SettingsCardTitle>Account settings</SettingsCardTitle>
        <SettingsCardDivider />

        <SettingsToggleRow
          title="Use as default PayPal account"
          description="New payments and invoices use this account when nothing else is specified."
          icon={<Star className="size-5" strokeWidth={1.75} aria-hidden />}
          checked={setAsDefaultChecked}
          disabled={setAsDefaultDisabled}
          tooltip={setAsDefaultTooltip}
          onCheckedChange={onSetAsDefaultChange}
          ariaLabel="Use as default PayPal account"
        />

        <SettingsCardDivider />

        <SettingsActionRow
          title="Payment methods"
          description="Enable the ways customers can pay at checkout."
          icon={<Settings2 className="size-5" strokeWidth={1.75} aria-hidden />}
          buttonLabel="Configure"
          onAction={onOpenPaymentMethods}
        />

        {showLegacyReconnect ? (
          <>
            <SettingsCardDivider />

            <SettingsPrimaryActionRow
              title="Reconnect PayPal integration"
              description="Update your credentials and ensure ongoing access to payment services with the new flow."
              icon={
                <RefreshCw className="size-5" strokeWidth={1.75} aria-hidden />
              }
              buttonLabel="Reconnect"
              onAction={onReconnect}
            />
          </>
        ) : null}

        <SettingsCardDivider />

        <SettingsActionRow
          title="Disconnect this PayPal account"
          description={disconnectDescription}
          icon={<LogOut className="size-5" strokeWidth={1.75} aria-hidden />}
          buttonLabel="Disconnect"
          buttonVariant="destructive"
          buttonDisabled={disconnectDisabled}
          buttonTooltip={disconnectTooltip}
          onAction={onDisconnect}
        />
      </SettingsCard>
    </div>
  )
}

function CredentialConfigurationCard({
  account,
  isDefaultAccount,
  onEditAccount,
  onModeChange,
  onClientIdChange,
  onSecretIdChange,
}: {
  account: PayPalAccount
  isDefaultAccount: boolean
  onEditAccount: () => void
  onModeChange: (mode: IntegrationEnvironment) => void
  onClientIdChange: (clientId: string) => void
  onSecretIdChange: (secretId: string) => void
}) {
  const [showSecret, setShowSecret] = useState(false)
  const readOnly = account.connected

  return (
    <SettingsCard>
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            {account.label} configuration
          </h2>
          <ConnectionStatusTag
            isConnected={account.connected}
            isDefault={isDefaultAccount}
          />
          <button
            type="button"
            aria-label={`Edit ${account.label}`}
            onClick={onEditAccount}
            className="flex size-[18px] shrink-0 items-center justify-center rounded text-[#475467] outline-none transition-colors hover:bg-[#f2f4f7] hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          >
            <Pencil className="size-[18px]" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <ModeSwitcher value={account.mode} onChange={onModeChange} />
      </div>

      <SettingsCardDivider />

      <div className="flex w-full flex-col gap-4">
        <CredentialField
          id={`${account.id}-client-id`}
          label="Client id"
          value={account.clientId}
          onChange={onClientIdChange}
          placeholder={envPlaceholder(account.mode, "client id")}
          readOnly={readOnly}
        />
        <CredentialField
          id={`${account.id}-secret-id`}
          label="Secret id"
          value={account.secretId}
          onChange={onSecretIdChange}
          placeholder={envPlaceholder(account.mode, "secret id")}
          readOnly={readOnly}
          masked={readOnly && !showSecret}
          type={readOnly && !showSecret ? "password" : "text"}
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
        <CredentialField
          id={`${account.id}-merchant-id`}
          label="Merchant id"
          value={account.merchantId}
          onChange={() => {}}
          placeholder="Merchant id"
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
    </SettingsCard>
  )
}

function OAuthConfigurationCard({
  account,
  isDefaultAccount,
  onEditAccount,
  onModeChange,
}: {
  account: PayPalAccount
  isDefaultAccount: boolean
  onEditAccount: () => void
  onModeChange: (mode: IntegrationEnvironment) => void
}) {
  return (
    <SettingsCard>
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            {account.label} configuration
          </h2>
          <ConnectionStatusTag
            isConnected
            isDefault={isDefaultAccount}
          />
          <button
            type="button"
            aria-label={`Edit ${account.label}`}
            onClick={onEditAccount}
            className="flex size-[18px] shrink-0 items-center justify-center rounded text-[#475467] outline-none transition-colors hover:bg-[#f2f4f7] hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          >
            <Pencil className="size-[18px]" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <ModeSwitcher value={account.mode} onChange={onModeChange} />
      </div>

      <SettingsCardDivider />

      <MetricsRow>
        <MetricItem
          icon={<UserRound className="size-5" strokeWidth={1.75} aria-hidden />}
          label="Connected as"
          value={account.name}
        />
        <MetricDivider />
        <MetricItem
          icon={<Mail className="size-5" strokeWidth={1.75} aria-hidden />}
          label="Email"
          value={account.email}
          action={
            <button
              type="button"
              aria-label="Copy email address"
              onClick={() => {
                void navigator.clipboard.writeText(account.email)
              }}
              className="flex size-5 shrink-0 items-center justify-center rounded text-[#475467] outline-none transition-colors hover:bg-[#f2f4f7] hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
            >
              <Copy className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          }
        />
      </MetricsRow>

      <SettingsCardDivider />

      <MetricsRow>
        <MetricItem
          icon={<KeyRound className="size-5" strokeWidth={1.75} aria-hidden />}
          label="Merchant id"
          value={
            <a
              href="https://www.paypal.com/businessprofile/settings/"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "inline-flex min-w-0 items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828] outline-none transition-colors hover:text-[#004eeb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
              )}
            >
              <span className="truncate">{account.merchantId}</span>
              <ExternalLink
                className="size-5 shrink-0"
                strokeWidth={1.75}
                aria-hidden
              />
            </a>
          }
        />
        <MetricDivider />
        <MetricItem
          icon={<Banknote className="size-5" strokeWidth={1.75} aria-hidden />}
          label="Total balance"
          value={account.totalBalance}
        />
      </MetricsRow>
    </SettingsCard>
  )
}

function CredentialField({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  masked = false,
  type = "text",
  trailing,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  placeholder: string
  readOnly?: boolean
  masked?: boolean
  type?: "text" | "password"
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <SettingsFormLabel htmlFor={id}>{label}</SettingsFormLabel>
      <CredentialInput
        id={id}
        type={masked ? "password" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        trailing={trailing}
      />
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
          type={readOnly && type === "password" ? "password" : readOnly ? "text" : type}
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
          type={readOnly && type === "password" ? "password" : readOnly ? "text" : type}
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

function MetricsRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 overflow-hidden">{children}</div>
  )
}

function MetricDivider() {
  return <span aria-hidden className="h-[34px] w-px shrink-0 bg-[#eaecf0]" />
}

function MetricItem({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f2f4f7] text-[#475467]">
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
          {label}
        </span>
        <div className="flex min-w-0 items-center gap-2">
          {typeof value === "string" ? (
            <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
              {value}
            </span>
          ) : (
            <div className="min-w-0 flex-1">{value}</div>
          )}
          {action}
        </div>
      </div>
    </div>
  )
}
