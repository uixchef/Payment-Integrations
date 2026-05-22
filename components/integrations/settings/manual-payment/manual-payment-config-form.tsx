"use client"

import { Check } from "lucide-react"
import { ConnectionStatusTag } from "@/components/integrations/settings/integration-settings-fields"
import {
  SettingsFormLabel,
  SettingsTextInput,
} from "@/components/integrations/settings/integration-settings-fields"
import {
  ENABLE_FOR_OPTIONS,
  MANUAL_PAYMENT_FIELD_HELPER,
  MANUAL_PAYMENT_MAX_CHARS,
  type ManualPaymentEnableFor,
  type ManualPaymentMethodForm,
  type ManualPaymentTabMeta,
} from "@/lib/manual-payment-data"
import { cn } from "@/lib/utils"

function SettingsTextarea({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  helperText,
}: {
  id: string
  value: string
  onChange: (next: string) => void
  placeholder: string
  maxLength: number
  helperText: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative flex min-h-[88px] flex-col rounded border border-[#d0d5dd] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] focus-within:border-[#84adff] focus-within:shadow-[0_0_0_4px_#eff4ff,0_1px_2px_rgba(16,24,40,0.05)]">
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className="min-h-[64px] w-full flex-1 resize-y bg-transparent px-3 pb-7 pt-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828] outline-none placeholder:text-[#667085]"
        />
        <span
          className="pointer-events-none absolute bottom-1.5 right-2.5 font-[family-name:var(--font-inter)] text-sm leading-5 text-[#667085]"
          aria-live="polite"
        >
          {value.length} / {maxLength} Chars
        </span>
      </div>
      <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#667085]">
        {helperText}
      </p>
    </div>
  )
}

function EnableForCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex shrink-0 cursor-pointer items-center gap-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#344054]"
    >
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "flex size-4 items-center justify-center rounded-[3px] border transition-colors",
            "border-[#d0d5dd] bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#84adff]",
            checked && "border-[#155eef] bg-[#155eef]"
          )}
          aria-hidden
        >
          {checked ? (
            <Check className="size-3 text-white" strokeWidth={3} aria-hidden />
          ) : null}
        </span>
      </span>
      <span>{label}</span>
    </label>
  )
}

export function ManualPaymentConfigForm({
  tabMeta,
  form,
  isEnabled,
  onChange,
}: {
  tabMeta: ManualPaymentTabMeta
  form: ManualPaymentMethodForm
  isEnabled: boolean
  onChange: (next: ManualPaymentMethodForm) => void
}) {
  const updateEnableFor = (key: keyof ManualPaymentEnableFor, value: boolean) => {
    onChange({
      ...form,
      enableFor: { ...form.enableFor, [key]: value },
    })
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {tabMeta.formTitle}
        </h2>
        <ConnectionStatusTag isConnected={isEnabled} />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <SettingsFormLabel htmlFor={`${tabMeta.id}-name`}>Name</SettingsFormLabel>
          <SettingsTextInput
            id={`${tabMeta.id}-name`}
            value={form.name}
            readOnly={tabMeta.nameReadOnly}
            placeholder={tabMeta.namePlaceholder}
            onChange={(name) => onChange({ ...form, name })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SettingsFormLabel htmlFor={`${tabMeta.id}-instructions`}>
            Payment instructions
          </SettingsFormLabel>
          <SettingsTextarea
            id={`${tabMeta.id}-instructions`}
            value={form.paymentInstructions}
            onChange={(paymentInstructions) =>
              onChange({ ...form, paymentInstructions })
            }
            placeholder={tabMeta.instructionsPlaceholder}
            maxLength={MANUAL_PAYMENT_MAX_CHARS}
            helperText={MANUAL_PAYMENT_FIELD_HELPER.instructions}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <SettingsFormLabel htmlFor={`${tabMeta.id}-message`}>Message</SettingsFormLabel>
          <SettingsTextarea
            id={`${tabMeta.id}-message`}
            value={form.message}
            onChange={(message) => onChange({ ...form, message })}
            placeholder={tabMeta.messagePlaceholder}
            maxLength={MANUAL_PAYMENT_MAX_CHARS}
            helperText={MANUAL_PAYMENT_FIELD_HELPER.message}
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
            Enable for
          </legend>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {ENABLE_FOR_OPTIONS.map((option) => (
              <EnableForCheckbox
                key={option.key}
                id={`${tabMeta.id}-${option.key}`}
                label={option.label}
                checked={form.enableFor[option.key]}
                onChange={(checked) => updateEnableFor(option.key, checked)}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )
}
