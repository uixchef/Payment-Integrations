"use client"

import {
  Banknote,
  CreditCard,
  ExternalLink,
  KeyRound,
  Mail,
  UserRound,
} from "lucide-react"
import {
  ConnectionStatusTag,
  ModeSwitcher,
  type IntegrationEnvironment,
} from "@/components/integrations/settings/integration-settings-fields"
import { Switch } from "@/components/ui/switch"
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
  /** True when this specific account is the default account of the default integration. */
  isDefaultAccount: boolean
  onModeChange: (mode: IntegrationEnvironment) => void
  onApplePayChange: (enabled: boolean) => void
}

export function StripeAccountConfig({
  account,
  isDefaultAccount,
  onModeChange,
  onApplePayChange,
}: StripeAccountConfigProps) {
  return (
    <div className="flex w-full max-w-[656px] flex-col">
      <div className="flex items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            {account.label} configuration
          </h2>
          {/*
           * The Default tag already lives on the account tab, so the body
           * header only surfaces the "Enabled" state (connected, non-default).
           */}
          {!isDefaultAccount ? (
            <ConnectionStatusTag isConnected isDefault={false} />
          ) : null}
        </div>
        <ModeSwitcher value={account.mode} onChange={onModeChange} />
      </div>

      <dl className="flex flex-col pt-6">
        <FieldRow
          icon={<UserRound className="size-4" strokeWidth={1.75} aria-hidden />}
          label="Connected as"
          value={<PlainValue>{account.name}</PlainValue>}
        />
        <FieldRow
          icon={<Mail className="size-4" strokeWidth={1.75} aria-hidden />}
          label="Email"
          value={<PlainValue>{account.email}</PlainValue>}
        />
        <FieldRow
          icon={<KeyRound className="size-4" strokeWidth={1.75} aria-hidden />}
          label="Merchant id"
          value={<MerchantIdChip id={account.merchantId} />}
        />
        <FieldRow
          icon={<Banknote className="size-4" strokeWidth={1.75} aria-hidden />}
          label="Total balance"
          value={<PlainValue>{account.totalBalance}</PlainValue>}
        />
        <FieldRow
          icon={<CreditCard className="size-4" strokeWidth={1.75} aria-hidden />}
          label="Register domains for Apple Pay and Link"
          subtitle="Enable seamless checkout experiences."
          value={
            <Switch
              checked={account.applePayEnabled}
              onCheckedChange={onApplePayChange}
              aria-label="Register domains for Apple Pay and Link"
            />
          }
          align="start"
        />
      </dl>
    </div>
  )
}

function FieldRow({
  icon,
  label,
  subtitle,
  value,
  align = "center",
}: {
  icon: React.ReactNode
  label: string
  subtitle?: string
  value: React.ReactNode
  align?: "start" | "center"
}) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4 border-b border-[#f2f4f7] py-3 last:border-b-0",
        align === "center" ? "h-[52px] items-center py-0" : "items-start"
      )}
    >
      <dt
        className={cn(
          "flex min-w-0 gap-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]",
          subtitle ? "items-start" : "items-center"
        )}
      >
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center text-[#475467]",
            subtitle && "mt-1"
          )}
        >
          {icon}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[#475467]">{label}</span>
          {subtitle ? (
            <span className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
              {subtitle}
            </span>
          ) : null}
        </span>
      </dt>
      <dd
        className={cn(
          "flex min-w-0 shrink-0",
          align === "center" ? "items-center" : "items-start pt-0.5"
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function PlainValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
      {children}
    </span>
  )
}

function MerchantIdChip({ id }: { id: string }) {
  return (
    <a
      href={`https://dashboard.stripe.com/${id}`}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded border border-[#039855] bg-white px-2",
        "font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#027a48]",
        "outline-none transition-colors hover:bg-[#ecfdf3] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      )}
    >
      <span className="truncate">{id}</span>
      <ExternalLink className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
    </a>
  )
}
