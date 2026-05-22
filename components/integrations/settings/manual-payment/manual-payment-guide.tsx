import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  MANUAL_PAYMENT_DOCS,
  MANUAL_PAYMENT_GUIDE,
  type ManualPaymentTab,
} from "@/lib/manual-payment-data"
import { cn } from "@/lib/utils"

export function ManualPaymentGuide({
  tab,
  isEnabled,
  className,
}: {
  tab: ManualPaymentTab
  isEnabled: boolean
  className?: string
}) {
  const steps = MANUAL_PAYMENT_GUIDE[tab]
  const title = isEnabled ? "Your guide" : "Quick start guide"

  return (
    <aside
      className={cn(
        "flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6",
        className
      )}
      aria-label={title}
    >
      <div className="flex items-center gap-2">
        <HelpCircle
          className="size-6 shrink-0 text-[#101828]"
          strokeWidth={1.75}
          aria-hidden
        />
        <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {title}
        </h2>
      </div>

      <ol className="flex flex-col gap-3">
        {steps.map((step) => (
          <li key={step.number} className="flex items-start gap-1">
            <span className="flex shrink-0 items-center py-0.5">
              <span className="flex items-center justify-center rounded bg-[#f5f8ff] px-1.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#004eeb]">
                {step.number}
              </span>
            </span>
            <p className="flex-1 font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
              <strong className="font-medium text-[#475467]">{step.lead}</strong>
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <Button asChild variant="neutral" className="w-full px-2">
        <a href={MANUAL_PAYMENT_DOCS} target="_blank" rel="noreferrer noopener">
          View documentation
        </a>
      </Button>
    </aside>
  )
}
