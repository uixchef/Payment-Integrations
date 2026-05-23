"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export type StripeSyncStep = {
  index: number
  title: string
  description: string
}

export const STRIPE_SYNC_STEPS: StripeSyncStep[] = [
  { index: 1, title: "Scan & configure", description: "Choose what to import." },
  { index: 2, title: "Review & select", description: "Confirm records to import." },
  { index: 3, title: "Confirm & import", description: "Review and start." },
  { index: 4, title: "Results", description: "Summary and sync status." },
]

type StepStatus = "complete" | "current" | "pending"

export function StripeSyncStepper({
  currentStep,
}: {
  currentStep: number
}) {
  return (
    <ol className="flex w-[240px] shrink-0 flex-col" aria-label="Stripe sync progress">
      {STRIPE_SYNC_STEPS.map((step, idx) => {
        const isLast = idx === STRIPE_SYNC_STEPS.length - 1
        const status: StepStatus =
          step.index < currentStep
            ? "complete"
            : step.index === currentStep
              ? "current"
              : "pending"
        // The line below a node is "traveled" (blue) when its own step is
        // current or already complete. Pending steps render a gray connector.
        const lineColor =
          status === "complete" || status === "current"
            ? "bg-[#155eef]"
            : "bg-[#d0d5dd]"

        return (
          <li key={step.index} className="flex flex-col">
            <div className="flex items-start gap-1">
              <div className="flex w-7 shrink-0 flex-col items-center self-stretch">
                <StepNode status={status} index={step.index} />
                {!isLast ? (
                  <span
                    aria-hidden
                    className={cn("min-h-px w-[2px] flex-1", lineColor)}
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p
                  className={cn(
                    "font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
                    status === "pending" ? "text-[#475467]" : "text-[#101828]"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
                    status === "pending" ? "text-[#667085]" : "text-[#475467]"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
            {!isLast ? (
              <div className="flex h-4 w-7 items-center justify-center">
                <span
                  aria-hidden
                  className={cn("h-full w-[2px]", lineColor)}
                />
              </div>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function StepNode({
  status,
  index,
}: {
  status: StepStatus
  index: number
}) {
  if (status === "complete") {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#155eef] bg-[#eff4ff]">
        <Image
          src="/integrations/stripe/sync-tick.png"
          alt=""
          width={38}
          height={33}
          unoptimized
          className="h-3 w-[14px] shrink-0 object-contain"
          aria-hidden
        />
      </span>
    )
  }
  if (status === "current") {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#155eef] bg-[#155eef] font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white">
        {index}
      </span>
    )
  }
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#d0d5dd] bg-white font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#98a2b3]">
      {index}
    </span>
  )
}
