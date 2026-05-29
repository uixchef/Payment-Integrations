"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function SettingsCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6",
        className
      )}
    >
      {children}
    </section>
  )
}

export function SettingsCardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
      {children}
    </h3>
  )
}

export function SettingsCardDivider() {
  return <div className="h-px w-full bg-[#eaecf0]" aria-hidden />
}

function SettingsIconBox({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f2f4f7] text-[#475467]",
        className
      )}
    >
      {children}
    </span>
  )
}

function SettingsRowCopy({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon: React.ReactNode
  action: React.ReactNode
}) {
  const descriptionRef = React.useRef<HTMLParagraphElement>(null)
  const [descriptionWraps, setDescriptionWraps] = React.useState(false)

  React.useLayoutEffect(() => {
    if (!description) {
      setDescriptionWraps(false)
      return
    }

    const node = descriptionRef.current
    if (!node) return

    const checkWrap = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight)
      const threshold = Number.isFinite(lineHeight) ? lineHeight * 1.5 : 30
      setDescriptionWraps(node.scrollHeight > threshold)
    }

    checkWrap()

    const observer = new ResizeObserver(checkWrap)
    observer.observe(node)
    return () => observer.disconnect()
  }, [description])

  const alignTop = Boolean(description && descriptionWraps)

  return (
    <div className={cn("flex gap-3", alignTop ? "items-start" : "items-center")}>
      <SettingsIconBox className={alignTop ? "mt-1" : undefined}>
        {icon}
      </SettingsIconBox>
      <div
        className={cn(
          "flex min-w-0 flex-1 gap-3",
          alignTop ? "items-start" : "items-center"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0">
          <p className="font-[family-name:var(--font-inter)] text-base leading-6 text-[#101828]">
            {title}
          </p>
          {description ? (
            <p
              ref={descriptionRef}
              className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]"
            >
              {description}
            </p>
          ) : null}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  )
}

export function SettingsToggleRow({
  title,
  description,
  icon,
  checked,
  disabled = false,
  tooltip,
  onCheckedChange,
  ariaLabel,
}: {
  title: string
  description?: string
  icon: React.ReactNode
  checked: boolean
  disabled?: boolean
  tooltip?: string
  onCheckedChange: (checked: boolean) => void
  ariaLabel: string
}) {
  const toggle = (
    <Switch
      size="sm"
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
    />
  )

  return (
    <SettingsRowCopy
      title={title}
      description={description}
      icon={icon}
      action={
        disabled && tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">{toggle}</span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="max-w-[280px]">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        ) : (
          toggle
        )
      }
    />
  )
}

export function SettingsOutlineButton({
  label,
  variant = "primary",
  disabled = false,
  tooltip,
  onClick,
  className,
}: {
  label: string
  variant?: "primary" | "destructive"
  disabled?: boolean
  tooltip?: string
  onClick?: () => void
  className?: string
}) {
  const button = (
    <Button
      type="button"
      variant="outline"
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "h-9 min-w-[109px] shrink-0 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        variant === "primary" &&
          "border-[#84adff] bg-white text-[#004eeb] hover:border-[#84adff] hover:bg-[#f5f8ff] hover:text-[#004eeb]",
        variant === "destructive" &&
          (disabled
            ? "cursor-not-allowed border-[#fecdca] bg-white text-[#fda29b] hover:border-[#fecdca] hover:bg-white hover:text-[#fda29b]"
            : "border-[#fda29b] bg-white text-[#b42318] hover:border-[#f97066] hover:bg-[#fef3f2] hover:text-[#b42318]"),
        className
      )}
    >
      {label}
    </Button>
  )

  if (disabled && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{button}</span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6} className="max-w-[280px]">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export function SettingsPrimaryButton({
  label,
  onClick,
  className,
}: {
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 min-w-[109px] shrink-0 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        "border border-[#155eef] bg-[#155eef] hover:border-[#004eeb] hover:bg-[#004eeb]",
        className
      )}
    >
      {label}
    </Button>
  )
}

export function SettingsPrimaryActionRow({
  title,
  description,
  icon,
  buttonLabel,
  onAction,
  buttonClassName,
}: {
  title: string
  description?: string
  icon: React.ReactNode
  buttonLabel: string
  onAction: () => void
  buttonClassName?: string
}) {
  return (
    <SettingsRowCopy
      title={title}
      description={description}
      icon={icon}
      action={
        <SettingsPrimaryButton
          label={buttonLabel}
          onClick={onAction}
          className={buttonClassName}
        />
      }
    />
  )
}

export function SettingsActionRow({
  title,
  description,
  icon,
  buttonLabel,
  buttonVariant = "primary",
  buttonDisabled = false,
  buttonTooltip,
  onAction,
  buttonClassName,
}: {
  title: string
  description?: string
  icon: React.ReactNode
  buttonLabel: string
  buttonVariant?: "primary" | "destructive"
  buttonDisabled?: boolean
  buttonTooltip?: string
  onAction: () => void
  buttonClassName?: string
}) {
  return (
    <SettingsRowCopy
      title={title}
      description={description}
      icon={icon}
      action={
        <SettingsOutlineButton
          label={buttonLabel}
          variant={buttonVariant}
          disabled={buttonDisabled}
          tooltip={buttonTooltip}
          onClick={onAction}
          className={buttonClassName}
        />
      }
    />
  )
}
