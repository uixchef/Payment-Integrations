"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronDown, Eye, EyeOff } from "lucide-react"
import {
  SettingsCard,
  SettingsCardDivider,
} from "@/components/integrations/settings/account-settings-card"
import {
  ConnectionStatusTag,
  ModeSwitcher,
  SettingsFormLabel,
  SettingsTextInput,
  type IntegrationEnvironment,
} from "@/components/integrations/settings/integration-settings-fields"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { flagAsset } from "@/lib/integration-assets"
import {
  MERCADO_PAGO_COUNTRIES,
  type MercadoPagoCountry,
} from "@/lib/mercado-pago-config-data"
import { cn } from "@/lib/utils"

const FLAG_CODES = new Set(["AR", "BR", "CL", "CO", "MX", "PE", "US", "UY"])

export type MercadoPagoFormState = {
  mode: IntegrationEnvironment
  publicKey: string
  accessToken: string
  country: string
  webhookSecret: string
}

function CountryFlag({ code }: { code: string }) {
  if (!FLAG_CODES.has(code)) {
    return null
  }

  return (
    <span className="relative size-5 shrink-0 overflow-hidden rounded-full">
      <Image
        src={flagAsset(code)}
        alt=""
        width={20}
        height={20}
        unoptimized
        className="size-5 object-cover"
        aria-hidden
      />
    </span>
  )
}

function CountrySelect({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (code: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const selected = MERCADO_PAGO_COUNTRIES.find((country) => country.code === value)

  const handleSelect = (country: MercadoPagoCountry) => {
    onChange(country.code)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id="mercado-pago-country"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded border border-[#d0d5dd] px-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none",
            disabled
              ? "cursor-default bg-[#f9fafb] text-[#98a2b3]"
              : "bg-white text-[#101828] hover:bg-[#f9fafb] focus-visible:border-[#84adff] focus-visible:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]"
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {selected ? (
              <>
                <CountryFlag code={selected.code} />
                <span className="truncate font-[family-name:var(--font-inter)] text-base leading-6">
                  {selected.label}
                </span>
              </>
            ) : (
              <span className="font-[family-name:var(--font-inter)] text-base leading-6 text-[#667085]">
                Choose a country
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0",
              disabled ? "text-[#98a2b3]" : "text-[#475467]"
            )}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-1"
      >
        <ul role="listbox" aria-label="Select country" className="max-h-60 overflow-y-auto">
          {MERCADO_PAGO_COUNTRIES.map((country) => {
            const active = country.code === value
            return (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(country)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-2 text-left font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828] outline-none",
                    "hover:bg-[#f2f4f7] focus-visible:bg-[#f2f4f7]",
                    active && "bg-[#f5f8ff]"
                  )}
                >
                  <CountryFlag code={country.code} />
                  <span className="min-w-0 flex-1 truncate">{country.label}</span>
                  {active ? (
                    <Check className="size-4 shrink-0 text-[#004eeb]" strokeWidth={2} aria-hidden />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  id: string
  value: string
  onChange: (next: string) => void
  placeholder: string
  readOnly?: boolean
}) {
  const [showValue, setShowValue] = useState(false)

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
          type={showValue || readOnly ? "text" : "password"}
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
        <button
          type="button"
          aria-label={showValue ? "Hide access token" : "Show access token"}
          onClick={() => setShowValue((current) => !current)}
          disabled={readOnly || value.length === 0}
          className={cn(
            "flex h-full items-center justify-center rounded-r px-2 outline-none transition-colors",
            readOnly || value.length === 0
              ? "cursor-not-allowed text-[#98a2b3]"
              : "cursor-pointer text-[#475467] hover:bg-[#f2f4f7] focus-visible:bg-[#f2f4f7]"
          )}
        >
          {showValue ? (
            <EyeOff className="size-5" strokeWidth={1.75} aria-hidden />
          ) : (
            <Eye className="size-5" strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}

export type MercadoPagoFormProps = {
  isConnected: boolean
  isDefault: boolean
  state: MercadoPagoFormState
  onStateChange: (next: MercadoPagoFormState) => void
}

export function MercadoPagoSettingsForm({
  isConnected,
  isDefault,
  state,
  onStateChange,
}: MercadoPagoFormProps) {
  const { mode, publicKey, accessToken, country, webhookSecret } = state
  const readOnly = isConnected

  const update = (patch: Partial<MercadoPagoFormState>) => {
    onStateChange({ ...state, ...patch })
  }

  return (
    <SettingsCard className="max-w-[756px]">
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Mercado Pago configuration
          </h2>
          <ConnectionStatusTag isConnected={isConnected} isDefault={isDefault} />
        </div>
        <ModeSwitcher value={mode} onChange={(next) => update({ mode: next })} />
      </div>

      <SettingsCardDivider />

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="mercado-pago-public-key" required>
            Public key
          </SettingsFormLabel>
          <SettingsTextInput
            id="mercado-pago-public-key"
            value={publicKey}
            onChange={(next) => update({ publicKey: next })}
            placeholder="Enter your Mercado Pago public key"
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="mercado-pago-access-token" required>
            Access token
          </SettingsFormLabel>
          <PasswordInput
            id="mercado-pago-access-token"
            value={accessToken}
            onChange={(next) => update({ accessToken: next })}
            placeholder="Enter your Mercado Pago access token"
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="mercado-pago-country" required>
            Select country
          </SettingsFormLabel>
          <CountrySelect
            value={country}
            onChange={(next) => update({ country: next })}
            disabled={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="mercado-pago-webhook-secret">
            Webhook secret
          </SettingsFormLabel>
          <SettingsTextInput
            id="mercado-pago-webhook-secret"
            value={webhookSecret}
            onChange={(next) => update({ webhookSecret: next })}
            placeholder="Enter your webhook secret"
            readOnly={readOnly}
          />
        </div>
      </div>
    </SettingsCard>
  )
}
