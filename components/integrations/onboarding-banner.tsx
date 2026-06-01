"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { CreditCard, Package } from "lucide-react"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { INTEGRATIONS } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  getOnboardingProductsCount,
  incrementOnboardingProducts,
  resolveOnboardingStepStatus,
  type OnboardingStepStatus,
} from "@/lib/onboarding-progress"
import { cn } from "@/lib/utils"

const BANNER = INTEGRATION_ASSETS.banner

type StepDefinition = {
  id: "connect" | "product" | "link"
  pendingTitle: string
  pendingAction: string
  completedTitle: string
  icon?: LucideIcon
  iconImages?: { active: string; muted: string }
}

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: "connect",
    pendingTitle: "Connect a provider",
    pendingAction: "Connect",
    completedTitle: "Provider(s) connected",
    icon: CreditCard,
  },
  {
    id: "product",
    pendingTitle: "Create your first product",
    pendingAction: "Create",
    completedTitle: "Product(s) created",
    icon: Package,
  },
  {
    id: "link",
    pendingTitle: "Accept via payment link",
    pendingAction: "Accept",
    completedTitle: "Accept via payment link",
    iconImages: {
      active: BANNER.linkActive,
      muted: BANNER.linkMuted,
    },
  },
]

function StepConnector() {
  return (
    <div
      className="pointer-events-none absolute left-full top-1/2 z-20 ml-1.5 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-[0_4px_4px_rgba(16,24,40,0.1),0_2px_2px_rgba(16,24,40,0.06)]"
      aria-hidden
    >
      <img
        src={BANNER.stepArrow}
        alt=""
        width={14}
        height={14}
        className="size-3.5"
        draggable={false}
      />
    </div>
  )
}

function CompletedStepIcon() {
  return (
    <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#d1fadf]">
      <div className="flex size-8 items-center justify-center rounded-full bg-[#a6f4c5]">
        <img
          src={BANNER.completedTick}
          alt=""
          width={16}
          height={16}
          className="size-4"
          draggable={false}
          aria-hidden
        />
      </div>
    </div>
  )
}

function StepIconBox({
  icon: Icon,
  iconImages,
  tone,
}: {
  icon?: LucideIcon
  iconImages?: { active: string; muted: string }
  tone: "active" | "muted"
}) {
  const imageSrc = iconImages?.[tone]

  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-lg",
        tone === "active" ? "bg-[#d1e0ff]" : "bg-[#f2f4f7]"
      )}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          width={32}
          height={32}
          className="size-8"
          draggable={false}
          aria-hidden
        />
      ) : Icon ? (
        <Icon
          className={cn(
            "size-8",
            tone === "active" ? "text-[#004eeb]" : "text-[#475467]"
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      ) : null}
    </div>
  )
}

function StepCard({
  status,
  title,
  action,
  actionEnabled,
  icon,
  iconImages,
  showConnector = false,
  onAction,
}: {
  status: OnboardingStepStatus
  title: string
  action?: string
  actionEnabled: boolean
  icon?: LucideIcon
  iconImages?: { active: string; muted: string }
  showConnector?: boolean
  onAction: () => void
}) {
  const isCompleted = status === "completed"
  const iconTone = status === "pending" ? "muted" : "active"
  const showAction = !isCompleted && action

  return (
    <div className="relative min-w-0 flex-1">
      <div className="flex w-full items-center gap-2 rounded-lg bg-white py-2 pl-2 pr-3">
        {isCompleted ? (
          <CompletedStepIcon />
        ) : (
          <StepIconBox icon={icon} iconImages={iconImages} tone={iconTone} />
        )}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            showAction ? "gap-1" : "justify-center"
          )}
        >
          <p className="line-clamp-2 text-sm font-medium leading-5 text-[#101828]">
            {title}
          </p>
          {showAction ? (
            <button
              type="button"
              disabled={!actionEnabled}
              onClick={onAction}
              className={cn(
                "self-start text-sm font-semibold leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40",
                actionEnabled
                  ? "text-[#004eeb] hover:underline"
                  : "cursor-not-allowed text-[#b2ccff]"
              )}
            >
              {action}
            </button>
          ) : null}
        </div>
      </div>
      {showConnector ? <StepConnector /> : null}
    </div>
  )
}

export function OnboardingBanner() {
  const router = useRouter()
  const { isConnected } = useIntegrationStatus()
  const [productsCount, setProductsCount] = useState(0)

  const connectedCount = INTEGRATIONS.reduce(
    (count, item) => (isConnected(item.id) ? count + 1 : count),
    0
  )

  const syncProductsCount = useCallback(() => {
    setProductsCount(getOnboardingProductsCount())
  }, [])

  useEffect(() => {
    syncProductsCount()
    window.addEventListener("onboarding-progress-change", syncProductsCount)
    window.addEventListener("storage", syncProductsCount)
    return () => {
      window.removeEventListener("onboarding-progress-change", syncProductsCount)
      window.removeEventListener("storage", syncProductsCount)
    }
  }, [syncProductsCount])

  const providersDone = connectedCount > 0
  const productsDone = productsCount > 0

  const statuses = STEP_DEFINITIONS.map((step) =>
    resolveOnboardingStepStatus(step.id, { providersDone, productsDone })
  )

  const getStepTitle = (step: StepDefinition, index: number) => {
    if (statuses[index] === "completed") return step.completedTitle
    return step.pendingTitle
  }

  const isStepActionEnabled = (index: number) => statuses[index] === "active"

  const handleStepAction = (step: StepDefinition, index: number) => {
    if (statuses[index] !== "active") return

    if (step.id === "connect") {
      router.push("/integrations?status=all")
      return
    }

    if (step.id === "product") {
      incrementOnboardingProducts()
      return
    }

    if (step.id === "link") {
      window.open(
        "https://help.gohighlevel.com/support/solutions/articles/48000980323-stripe-integration",
        "_blank",
        "noopener,noreferrer"
      )
    }
  }

  return (
    <section
      aria-label="Accept your first payment"
      className="w-full shrink-0 overflow-hidden rounded bg-[#eff4ff]"
    >
      <div className="flex w-full min-w-0 items-center gap-4 p-4 sm:gap-8">
        <div className="shrink">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Accept your first payment
          </h2>
          <p className="mt-0.5 font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
            Set up your provider and start getting paid in just 3 simple steps.
          </p>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {STEP_DEFINITIONS.map((step, index) => (
            <StepCard
              key={step.id}
              status={statuses[index]}
              title={getStepTitle(step, index)}
              action={
                statuses[index] === "completed" ? undefined : step.pendingAction
              }
              actionEnabled={isStepActionEnabled(index)}
              icon={step.icon}
              iconImages={step.iconImages}
              showConnector={index < STEP_DEFINITIONS.length - 1}
              onAction={() => handleStepAction(step, index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
