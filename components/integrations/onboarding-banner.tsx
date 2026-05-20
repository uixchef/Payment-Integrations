import {
  LinkStepPreview,
  ProductsStepPreview,
  ProvidersStepPreview,
} from "@/components/integrations/banner-step-previews"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { cn } from "@/lib/utils"

const BANNER = INTEGRATION_ASSETS.banner

const steps = [
  {
    id: "connect",
    title: "Connect a provider",
    action: "Connect",
    actionEnabled: true,
    preview: <ProvidersStepPreview />,
  },
  {
    id: "product",
    title: "Create your first product",
    action: "Create",
    actionEnabled: true,
    preview: <ProductsStepPreview />,
  },
  {
    id: "link",
    title: "Accept via payment link",
    action: "Accept",
    actionEnabled: false,
    preview: <LinkStepPreview />,
  },
] as const

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

function StepCard({
  title,
  action,
  actionEnabled,
  preview,
  showConnector = false,
}: (typeof steps)[number] & { showConnector?: boolean }) {
  return (
    <div className="relative w-[280px] shrink-0">
      <div className="flex h-[88px] w-full gap-3 overflow-hidden rounded-lg bg-white py-2 pl-2 pr-3">
        {preview}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <p className="text-sm font-medium leading-5 text-[#101828]">{title}</p>
          <button
            type="button"
            disabled={!actionEnabled}
            className={cn(
              "self-start text-sm font-semibold leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40",
              actionEnabled
                ? "text-[#004eeb] hover:underline"
                : "cursor-not-allowed text-[#b2ccff]"
            )}
          >
            {action}
          </button>
        </div>
      </div>
      {showConnector ? <StepConnector /> : null}
    </div>
  )
}

export function OnboardingBanner() {
  return (
    <section
      aria-label="Accept your first payment"
      className="w-full shrink-0 rounded bg-[#eff4ff] py-3 pl-4 pr-3"
    >
      <div className="flex w-full flex-col items-start gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full max-w-[252px] shrink-0 xl:max-w-[440px]">
          <h2 className="text-base font-semibold leading-6 text-[#101828]">
            Accept your first payment
          </h2>
          <p className="mt-0.5 text-sm leading-5 text-[#475467] xl:whitespace-nowrap">
            Set up your provider and start getting paid in just 3 simple steps.
          </p>
        </div>

        {/* Figma 2147:38993 — equal-width cards, 12px gap, chevrons overlap the gap */}
        <div className="w-full min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] xl:w-auto xl:shrink-0 [&::-webkit-scrollbar]:hidden">
          <div className="ml-auto flex min-w-max items-start gap-3 xl:ml-0">
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                {...step}
                showConnector={index < steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
