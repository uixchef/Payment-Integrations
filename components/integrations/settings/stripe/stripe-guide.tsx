"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const STRIPE_DOCS_HREF =
  "https://help.gohighlevel.com/support/solutions/articles/48000980323-stripe-integration"

const STEPS: { number: number; content: React.ReactNode }[] = [
  {
    number: 1,
    content: (
      <>
        <strong className="font-medium text-[#475467]">Start in test mode</strong>{" "}
        to simulate transactions without using real money.
      </>
    ),
  },
  {
    number: 2,
    content: (
      <>
        <strong className="font-medium text-[#475467]">Get your Stripe credentials</strong>{" "}
        from the Stripe Developer dashboard.
      </>
    ),
  },
  {
    number: 3,
    content: (
      <>
        <strong className="font-medium text-[#475467]">Connect and test</strong>{" "}
        your credentials to make sure everything is functioning properly.
      </>
    ),
  },
  {
    number: 4,
    content: (
      <>
        <strong className="font-medium text-[#475467]">Switch to live mode</strong>{" "}
        when you&apos;re ready to start accepting real payments.
      </>
    ),
  },
]

export function StripeGuide({ isConnected }: { isConnected: boolean }) {
  const title = isConnected ? "Your guide" : "Quick start guide"

  return (
    <aside
      aria-label={title}
      className="flex h-fit w-[384px] shrink-0 flex-col gap-4 rounded border border-[#d0d5dd] bg-white p-6"
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
        {STEPS.map((step) => (
          <li key={step.number} className="flex items-start gap-1">
            <span className="flex shrink-0 items-center py-0.5">
              <span className="flex items-center justify-center rounded bg-[#f5f8ff] px-1.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#004eeb]">
                {step.number}
              </span>
            </span>
            <p className="flex-1 font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
              {step.content}
            </p>
          </li>
        ))}
      </ol>

      <Button asChild variant="neutral" className="w-full px-2">
        <a href={STRIPE_DOCS_HREF} target="_blank" rel="noreferrer noopener">
          View documentation
        </a>
      </Button>
    </aside>
  )
}
