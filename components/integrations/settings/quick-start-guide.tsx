import { HelpCircle } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GuideStep = {
  number: number
  content: ReactNode
}

const RAZORPAY_STEPS: GuideStep[] = [
  {
    number: 1,
    content: (
      <>
        Click on <strong className="font-medium text-[#475467]">Manage</strong> and go to
        Razorpay app page.
      </>
    ),
  },
  {
    number: 2,
    content: <>Select the Authentication section.</>,
  },
  {
    number: 3,
    content: (
      <>
        Add the <strong className="font-medium text-[#475467]">Test</strong> or/and{" "}
        <strong className="font-medium text-[#475467]">Live</strong> credentials generated
        from{" "}
        <strong className="font-medium text-[#475467]">
          Razorpay dashboard &gt; Account &amp; Settings &gt; API keys &gt; Generate key.
        </strong>
      </>
    ),
  },
  {
    number: 4,
    content: (
      <>
        Select <strong className="font-medium text-[#475467]">Fixed schedule subscription</strong> or{" "}
        <strong className="font-medium text-[#475467]">Charge when needed</strong>, based on what
        is active in your Razorpay account.
      </>
    ),
  },
  {
    number: 5,
    content: (
      <>
        Click <strong className="font-medium text-[#475467]">Save</strong> or{" "}
        <strong className="font-medium text-[#475467]">Connect</strong>.
      </>
    ),
  },
  {
    number: 6,
    content: (
      <>
        You can also set it as the{" "}
        <strong className="font-medium text-[#475467]">default provider</strong> for all channels.
      </>
    ),
  },
]

const AUTHORIZE_NET_STEPS: GuideStep[] = [
  {
    number: 1,
    content: (
      <>
        <strong className="font-medium text-[#475467]">
          Get your Authorize.net API credentials.
        </strong>{" "}
        Log in to your Authorize.net Merchant Interface and navigate to Account
        &gt; API Credentials &amp; Keys.
      </>
    ),
  },
  {
    number: 2,
    content: (
      <>
        <strong className="font-medium text-[#475467]">
          Enter your credentials here.
        </strong>{" "}
        Paste your Login ID, Transaction Key, and Signature Key into the fields
        on the left.
      </>
    ),
  },
  {
    number: 3,
    content: (
      <>
        <strong className="font-medium text-[#475467]">
          Save and verify connection.
        </strong>{" "}
        Make sure the credentials are valid and that the connection is
        successful.
      </>
    ),
  },
  {
    number: 4,
    content: (
      <>
        <strong className="font-medium text-[#475467]">
          Switch to test mode (optional).
        </strong>{" "}
        Run simulated transactions to ensure everything functions correctly
        before going live.
      </>
    ),
  },
]

const PROVIDER_STEPS: Record<string, GuideStep[]> = {
  razorpay: RAZORPAY_STEPS,
  "authorize-net": AUTHORIZE_NET_STEPS,
}

function StepRow({ number, content }: GuideStep) {
  return (
    <li className="flex items-start gap-1">
      <span className="flex shrink-0 items-center py-0.5">
        <span className="flex items-center justify-center rounded bg-[#f5f8ff] px-1.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#004eeb]">
          {number}
        </span>
      </span>
      <p className="flex-1 font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
        {content}
      </p>
    </li>
  )
}

export function QuickStartGuide({
  providerId,
  documentationHref,
  isConnected = false,
  className,
}: {
  providerId: string
  documentationHref?: string
  isConnected?: boolean
  className?: string
}) {
  const steps = PROVIDER_STEPS[providerId] ?? []

  if (steps.length === 0) {
    return null
  }

  const title = isConnected ? "Your guide" : "Quick start guide"

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
          <StepRow key={step.number} {...step} />
        ))}
      </ol>

      <Button asChild variant="neutral" className="w-full px-2">
        <a href={documentationHref ?? "#"} target="_blank" rel="noreferrer noopener">
          View documentation
        </a>
      </Button>
    </aside>
  )
}
