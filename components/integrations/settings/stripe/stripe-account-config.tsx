"use client"

import {
  Banknote,
  Copy,
  ExternalLink,
  Globe,
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  Settings2,
  Star,
  UserRound,
} from "lucide-react"
import {
  SettingsActionRow,
  SettingsCard,
  SettingsCardDivider,
  SettingsCardTitle,
  SettingsToggleRow,
} from "@/components/integrations/settings/account-settings-card"
import {
  ConnectionStatusTag,
  ModeSwitcher,
  type IntegrationEnvironment,
} from "@/components/integrations/settings/integration-settings-fields"
import { cn } from "@/lib/utils"

export type StripeAccount = {
  id: string
  label: string
  connected: boolean
  name: string
  email: string
  merchantId: string
  totalBalance: string
  applePayEnabled: boolean
  mode: IntegrationEnvironment
}

type StripeAccountConfigProps = {
  account: StripeAccount
  isDefaultAccount: boolean
  setAsDefaultChecked: boolean
  setAsDefaultDisabled: boolean
  setAsDefaultTooltip?: string
  disconnectDisabled: boolean
  disconnectTooltip?: string
  disconnectDescription: string
  onModeChange: (mode: IntegrationEnvironment) => void
  onApplePayChange: (enabled: boolean) => void
  onSetAsDefaultChange: (checked: boolean) => void
  onOpenPaymentMethods: () => void
  onEditAccount: () => void
  onDisconnect: () => void
}

export function StripeAccountConfig({
  account,
  isDefaultAccount,
  setAsDefaultChecked,
  setAsDefaultDisabled,
  setAsDefaultTooltip,
  disconnectDisabled,
  disconnectTooltip,
  disconnectDescription,
  onModeChange,
  onApplePayChange,
  onSetAsDefaultChange,
  onOpenPaymentMethods,
  onEditAccount,
  onDisconnect,
}: StripeAccountConfigProps) {
  return (
    <div className="flex w-full max-w-[756px] flex-col gap-6">
      <SettingsCard>
        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
              {account.label} configuration
            </h2>
            <ConnectionStatusTag isConnected isDefault={isDefaultAccount} />
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
                href={`https://dashboard.stripe.com/${account.merchantId}`}
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

      <SettingsCard>
        <SettingsCardTitle>Account settings</SettingsCardTitle>
        <SettingsCardDivider />

        <SettingsToggleRow
          title="Register domains for Apple Pay and Link"
          description="Enable seamless checkout experiences."
          icon={<Globe className="size-5" strokeWidth={1.75} aria-hidden />}
          checked={account.applePayEnabled}
          onCheckedChange={onApplePayChange}
          ariaLabel="Register domains for Apple Pay and Link"
        />

        <SettingsCardDivider />

        <SettingsToggleRow
          title="Use as default Stripe account"
          description="New payments and invoices use this account when nothing else is specified."
          icon={<Star className="size-5" strokeWidth={1.75} aria-hidden />}
          checked={setAsDefaultChecked}
          disabled={setAsDefaultDisabled}
          tooltip={setAsDefaultTooltip}
          onCheckedChange={onSetAsDefaultChange}
          ariaLabel="Use as default Stripe account"
        />

        <SettingsCardDivider />

        <SettingsActionRow
          title="Payment methods"
          description="Enable the ways customers can pay at checkout."
          icon={<Settings2 className="size-5" strokeWidth={1.75} aria-hidden />}
          buttonLabel="Configure"
          onAction={onOpenPaymentMethods}
        />

        <SettingsCardDivider />

        <SettingsActionRow
          title="Disconnect this Stripe account"
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
