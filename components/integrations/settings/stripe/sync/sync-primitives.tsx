"use client"

import * as React from "react"
import {
  ArrowLeftRight,
  Contact,
  Info,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type {
  AvatarTone,
  CardBrand,
  NotEligibleReason,
  SavedPaymentMethod,
} from "./sync-mock-data"

/* -------------------------------------------------------------------------- */
/* Toggle card                                                                */
/* -------------------------------------------------------------------------- */

type ToggleIconKey = "import-subscriptions" | "contact-payment-method-sync"

function FeaturedIcon({
  iconKey,
  selected,
}: {
  iconKey: ToggleIconKey
  selected: boolean
}) {
  const Icon =
    iconKey === "import-subscriptions" ? ArrowLeftRight : Contact
  return (
    <span
      aria-hidden
      className={cn(
        // The "featured icon" pattern: filled inner circle wrapped in a
        // lighter 4px ring. mix-blend-multiply lets the chip read on white
        // and on a tinted card background equivalently.
        "relative flex size-8 shrink-0 items-center justify-center rounded-full border-4 mix-blend-multiply",
        selected
          ? "border-[#eff4ff] bg-[#d1e0ff]"
          : "border-[#f2f4f7] bg-[#eaecf0]"
      )}
    >
      <Icon
        className={cn(
          "size-4",
          selected ? "text-[#155eef]" : "text-[#475467]"
        )}
        strokeWidth={1.75}
      />
    </span>
  )
}

export function ToggleCard({
  iconKey,
  title,
  checked,
  onCheckedChange,
}: {
  iconKey: ToggleIconKey
  title: string
  checked: boolean
  onCheckedChange: (next: boolean) => void
}) {
  return (
    <div
      role="group"
      aria-label={title}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-[4px] border bg-white p-3 transition-colors",
        checked
          ? "border-[#155eef] shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
          : "border-[#d0d5dd] hover:border-[#98a2b3]"
      )}
    >
      <FeaturedIcon iconKey={iconKey} selected={checked} />
      <div className="flex min-w-0 flex-1 items-center">
        <p className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          {title}
        </p>
      </div>
      <div className="flex shrink-0 items-center">
        <Switch
          size="sm"
          checked={checked}
          onCheckedChange={onCheckedChange}
          onClick={(event) => event.stopPropagation()}
          aria-label={title}
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Radio (sm) — Figma Radio Card control                                      */
/* -------------------------------------------------------------------------- */

/** 16×16 rounded control with inset check when selected (HighRise radio sm). */
export function RadioControl({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative size-4 shrink-0 overflow-hidden rounded-[8px] border border-solid",
        checked
          ? "border-[#155eef] bg-[#155eef]"
          : "border-[#98a2b3] bg-white"
      )}
    >
      {checked ? (
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="pointer-events-none absolute inset-[calc(31.25%-0.38px)] size-full"
          fill="none"
        >
          <path
            d="M12.2 5.2 6.8 10.6 3.8 7.6"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Radio card                                                                 */
/* -------------------------------------------------------------------------- */

export function RadioCard({
  name,
  value,
  selectedValue,
  title,
  description,
  icon: Icon,
  onSelect,
}: {
  name: string
  value: string
  selectedValue: string
  title: string
  description: string
  icon: LucideIcon
  onSelect: (next: string) => void
}) {
  const selected = value === selectedValue
  const inputId = `${name}-${value}`
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex w-full cursor-pointer items-start gap-2 rounded-[4px] border bg-white px-2 py-2 transition-colors",
        selected
          ? "border-[#155eef]"
          : "border-[#d0d5dd] hover:border-[#98a2b3]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative flex size-8 shrink-0 items-center justify-center rounded-full border-4 mix-blend-multiply",
          selected
            ? "border-[#eff4ff] bg-[#d1e0ff]"
            : "border-[#f2f4f7] bg-[#eaecf0]"
        )}
      >
        <Icon
          className={cn(
            "size-4",
            selected ? "text-[#155eef]" : "text-[#475467]"
          )}
          strokeWidth={1.75}
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
        <p className="font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#101828]">
          {title}
        </p>
        <p className="font-[family-name:var(--font-inter)] text-sm font-normal leading-5 text-[#475467]">
          {description}
        </p>
      </div>
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <RadioControl checked={selected} />
    </label>
  )
}

/* -------------------------------------------------------------------------- */
/* Info banner (step 2 contextual hint)                                       */
/* -------------------------------------------------------------------------- */

export function InfoBanner({
  title,
  description,
  onDismiss,
}: {
  title: string
  description: string
  /** Optional. When provided, renders an X close button that calls this. */
  onDismiss?: () => void
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-[4px] bg-[#f9fafb] p-2"
    >
      <span className="flex shrink-0 items-center py-1">
        <Info className="size-5 text-[#475467]" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex w-full flex-col gap-0.5">
          <p className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#344054]">
            {title}
          </p>
          <p className="font-[family-name:var(--font-inter)] text-sm font-normal leading-5 text-[#475467]">
            {description}
          </p>
        </div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className={cn(
            "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#475467] outline-none transition-colors",
            "hover:bg-[#f2f4f7] hover:text-[#101828] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Selection summary chip (above table when rows are selected)                */
/* -------------------------------------------------------------------------- */

export function SelectionSummary({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
}: {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onClear: () => void
}) {
  return (
    <div className="flex h-8 items-center gap-3 font-[family-name:var(--font-inter)]">
      <span className="text-base font-normal leading-6 text-[#475467]">
        {selectedCount} of {totalCount} selected
      </span>
      {selectedCount < totalCount ? (
        <button
          type="button"
          onClick={onSelectAll}
          className={cn(
            "cursor-pointer text-base font-semibold leading-6 text-[#004eeb] outline-none",
            "hover:text-[#0040c1] focus-visible:underline"
          )}
        >
          Select all({totalCount})
        </button>
      ) : null}
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        className={cn(
          "flex h-full cursor-pointer items-center justify-center rounded-[4px] px-1 py-2 outline-none",
          "transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
        )}
      >
        <CancelIcon />
      </button>
    </div>
  )
}

/**
 * Material "cancel" glyph — filled dark circle with a white X. Inlined as
 * SVG so it stays crisp at any zoom/DPR and avoids the recurring pixelation
 * issues we've hit with small PNG icons in this project.
 */
function CancelIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className="block size-4 shrink-0"
    >
      <circle cx="8" cy="8" r="7" fill="#0b0b0b" />
      <path
        d="M5.5 5.5 10.5 10.5 M10.5 5.5 5.5 10.5"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Avatar with initials                                                       */
/* -------------------------------------------------------------------------- */

const AVATAR_TONES: Record<AvatarTone, { bg: string; text: string }> = {
  blue: { bg: "bg-[#d1e0ff]", text: "text-[#155eef]" },
  amber: { bg: "bg-[#fef0c7]", text: "text-[#b54708]" },
  emerald: { bg: "bg-[#d1fadf]", text: "text-[#027a48]" },
  rose: { bg: "bg-[#fee4e2]", text: "text-[#b42318]" },
  violet: { bg: "bg-[#e9d7fe]", text: "text-[#6927da]" },
  slate: { bg: "bg-[#eaecf0]", text: "text-[#475467]" },
  teal: { bg: "bg-[#ccfbef]", text: "text-[#107569]" },
  fuchsia: { bg: "bg-[#fce7f6]", text: "text-[#c11574]" },
}

export function AvatarInitials({
  initials,
  tone,
  size = 24,
}: {
  initials: string
  tone: AvatarTone
  size?: number
}) {
  const { bg, text } = AVATAR_TONES[tone]
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-inter)] text-[11px] font-semibold leading-none uppercase",
        bg,
        text
      )}
    >
      {initials}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Brand chip (small wordmark-style card brand chip)                          */
/* -------------------------------------------------------------------------- */

const BRAND_STYLES: Record<
  CardBrand,
  { label: string; bg: string; text: string }
> = {
  visa: { label: "VISA", bg: "bg-[#1a1f71]", text: "text-white" },
  mastercard: { label: "MC", bg: "bg-[#eb001b]", text: "text-white" },
  amex: { label: "AMEX", bg: "bg-[#0070d1]", text: "text-white" },
  discover: { label: "DISC", bg: "bg-[#f68121]", text: "text-white" },
  jcb: { label: "JCB", bg: "bg-[#005a9c]", text: "text-white" },
  diners: { label: "DC", bg: "bg-[#0079be]", text: "text-white" },
  unionpay: { label: "UP", bg: "bg-[#d62128]", text: "text-white" },
  applepay: { label: "Pay", bg: "bg-[#0b0b0b]", text: "text-white" },
  googlepay: { label: "Pay", bg: "bg-[#1a73e8]", text: "text-white" },
  amazonpay: { label: "amzn", bg: "bg-[#ff9900]", text: "text-white" },
  affirm: { label: "affm", bg: "bg-[#0fa0ea]", text: "text-white" },
  alipay: { label: "ali", bg: "bg-[#1677ff]", text: "text-white" },
  klarna: { label: "K", bg: "bg-[#ffa8cd]", text: "text-[#0b0b0b]" },
}

export function BrandChip({ brand }: { brand: CardBrand }) {
  const cfg = BRAND_STYLES[brand]
  return (
    <span
      aria-label={brand}
      className={cn(
        "inline-flex h-[18px] min-w-[28px] items-center justify-center rounded-[3px] px-1 font-[family-name:var(--font-inter)] text-[9px] font-bold leading-none tracking-wide",
        cfg.bg,
        cfg.text
      )}
    >
      {cfg.label}
    </span>
  )
}

const paymentMethodTagShellClassName =
  "inline-flex h-7 max-h-7 min-h-7 shrink-0 items-center gap-1 rounded bg-[#f2f4f7] px-2"

const paymentMethodTagLabelClassName =
  "whitespace-nowrap font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054]"

function PaymentMethodTag({ method }: { method: SavedPaymentMethod }) {
  return (
    <span className={paymentMethodTagShellClassName}>
      <BrandChip brand={method.brand} />
      <span className={paymentMethodTagLabelClassName}>••••{method.last4}</span>
    </span>
  )
}

function PaymentMethodsTooltipContent({
  methods,
}: {
  methods: SavedPaymentMethod[]
}) {
  return (
    <div className="flex w-fit flex-wrap items-center gap-1">
      {methods.map((method, index) => (
        <PaymentMethodTag
          key={`${method.brand}-${method.last4}-${index}`}
          method={method}
        />
      ))}
    </div>
  )
}

export function SavedPaymentMethodDisplay({
  methods,
  className,
}: {
  methods: SavedPaymentMethod[]
  className?: string
}) {
  if (methods.length === 0) return null

  const primary = methods[0]
  const extraMethods = methods.slice(1)
  const extraCount = extraMethods.length

  return (
    <div
      className={cn(
        "flex min-w-0 w-full items-center gap-1 overflow-hidden font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467]",
        className
      )}
    >
      <BrandChip brand={primary.brand} />
      <span className="flex min-w-0 items-center truncate font-[family-name:var(--font-inter)] text-base font-medium leading-6">
        <span className="truncate">••••{primary.last4}</span>
        {extraCount > 0 ? (
          <>
            <span className="shrink-0">, </span>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`${extraCount} more payment methods. Hover to preview.`}
                  className="shrink-0 cursor-default bg-transparent p-0 font-[family-name:var(--font-inter)] text-base font-medium leading-6 text-[#475467] outline-none focus-visible:ring-2 focus-visible:ring-[#84adff]"
                  onClick={(event) => event.stopPropagation()}
                >
                  +{extraCount}
                </button>
              </TooltipTrigger>
              <TooltipContent
                fitContent
                side="top"
                align="start"
                sideOffset={6}
                className="rounded border-0 p-2 text-left shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
              >
                <PaymentMethodsTooltipContent methods={extraMethods} />
              </TooltipContent>
            </Tooltip>
          </>
        ) : null}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Status pill (Matched / New)                                                */
/* -------------------------------------------------------------------------- */

export function StatusPill({ status }: { status: "matched" | "new" }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-[6px] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
        status === "matched"
          ? "bg-[#ecfdf3] text-[#027a48]"
          : "bg-[#eff4ff] text-[#155eef]"
      )}
    >
      {status === "matched" ? "Matched" : "New"}
    </span>
  )
}

/** Subscription lifecycle badge — Figma success pill (Active). */
export function SubscriptionStatusPill({
  status,
}: {
  status: "active"
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-[12px] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
        status === "active" && "bg-[#ecfdf3] text-[#027a48]"
      )}
    >
      Active
    </span>
  )
}

/** Not-eligible reason badge — Figma warning pill. */
export function NotEligibleReasonPill({ reason }: { reason: NotEligibleReason }) {
  return (
    <span
      className="inline-flex h-6 max-w-full items-center truncate rounded-[12px] bg-[#fffaeb] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#b54708]"
      title={reason}
    >
      {reason}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Checkbox                                                                   */
/* -------------------------------------------------------------------------- */

export function Checkbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean
  indeterminate?: boolean
  onCheckedChange: (next: boolean) => void
  ariaLabel?: string
}) {
  const ref = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className="relative inline-flex size-[14px] cursor-pointer items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        aria-label={ariaLabel}
        className="peer absolute size-full cursor-pointer appearance-none rounded-[2px] border border-[#98a2b3] bg-white outline-none transition-colors checked:border-[#004eeb] checked:bg-[#004eeb] indeterminate:border-[#004eeb] indeterminate:bg-[#004eeb] hover:border-[#84adff] focus-visible:ring-2 focus-visible:ring-[#84adff] focus-visible:ring-offset-1"
      />
      {checked && !indeterminate ? (
        <svg
          aria-hidden
          viewBox="0 0 14 14"
          className="pointer-events-none relative size-[10px] text-white"
          fill="none"
        >
          <path
            d="M11.7 4 5.3 10.4 2.4 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : indeterminate ? (
        <svg
          aria-hidden
          viewBox="0 0 14 14"
          className="pointer-events-none relative size-[10px] text-white"
          fill="none"
        >
          <path
            d="M2.5 7h9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
    </label>
  )
}
