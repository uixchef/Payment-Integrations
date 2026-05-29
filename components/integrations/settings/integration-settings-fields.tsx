"use client"

import { cn } from "@/lib/utils"

export type IntegrationEnvironment = "live" | "test"

export function ModeSwitcher({
  value,
  onChange,
}: {
  value: IntegrationEnvironment
  onChange: (mode: IntegrationEnvironment) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Environment"
      className="inline-flex h-9 shrink-0 gap-2 overflow-hidden rounded bg-[#f9fafb] p-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
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
              "inline-flex h-full min-w-[48px] items-center justify-center rounded px-2 font-[family-name:var(--font-inter)] text-base leading-6 capitalize outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-[#84adff]",
              active
                ? "bg-white font-semibold text-[#004eeb] shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)]"
                : "bg-transparent font-medium text-[#475467] hover:text-[#344054]"
            )}
          >
            {mode}
          </button>
        )
      })}
    </div>
  )
}

export type IntegrationStatusTagVariant = "not-connected" | "enabled" | "default"

const STATUS_TAG_STYLES: Record<
  IntegrationStatusTagVariant,
  { label: string; className: string }
> = {
  "not-connected": {
    label: "Not connected",
    className: "bg-[#fef3f2] text-[#b42318]",
  },
  enabled: {
    label: "Enabled",
    className: "bg-[#ecfdf3] text-[#027a48]",
  },
  default: {
    label: "Default",
    className: "bg-[#eff4ff] text-[#004eeb]",
  },
}

export function getIntegrationStatusTagVariant(
  isConnected: boolean,
  isDefault: boolean
): IntegrationStatusTagVariant | null {
  if (!isConnected) return "not-connected"
  if (isDefault) return null
  return "enabled"
}

export function ConnectionStatusTag({
  isConnected,
  isDefault = false,
}: {
  isConnected: boolean
  isDefault?: boolean
}) {
  const variant = getIntegrationStatusTagVariant(isConnected, isDefault)
  if (!variant) return null

  const { label, className } = STATUS_TAG_STYLES[variant]

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-xl px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
        className
      )}
    >
      {label}
    </span>
  )
}

export function SettingsFormLabel({
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
      className="flex items-center gap-1 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]"
    >
      <span>{children}</span>
      {required ? <span className="text-[#d92d20]">*</span> : null}
    </label>
  )
}

export function SettingsTextInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  id: string
  type?: "text" | "password"
  value: string
  onChange: (next: string) => void
  placeholder: string
  readOnly?: boolean
}) {
  const inputType = readOnly ? "text" : type

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
        type={inputType}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "min-w-0 flex-1 bg-transparent font-[family-name:var(--font-inter)] text-base leading-6 outline-none placeholder:text-[#667085]",
          readOnly
            ? "cursor-default text-[#98a2b3]"
            : "text-[#101828]"
        )}
      />
    </div>
  )
}

export function envPlaceholder(
  mode: IntegrationEnvironment,
  label: string
): string {
  const prefix = mode === "live" ? "Live" : "Test"
  return `${prefix} ${label}`
}
