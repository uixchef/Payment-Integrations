"use client"

import {
  Phone,
  Megaphone,
  HelpCircle,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  resolveIntegrationStatusTab,
  type IntegrationStatusTab,
} from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import { INTEGRATIONS } from "@/lib/integrations-data"
import {
  PAYMENTS_HUB_DEFAULTS,
  getIntegrationsHubPath,
  resolvePaymentsHubNavUrls,
  type PaymentsHubNavUrls,
} from "@/lib/payment-hub-nav"
import { cn } from "@/lib/utils"

function Settings04Icon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3333 3.33333C10.5969 3.33333 10 3.93029 10 4.66667C10 5.40305 10.5969 6 11.3333 6C12.0697 6 12.6667 5.40305 12.6667 4.66667C12.6667 3.93029 12.0697 3.33333 11.3333 3.33333ZM8.75068 4C9.04671 2.84985 10.0908 2 11.3333 2C12.8061 2 14 3.19391 14 4.66667C14 6.13943 12.8061 7.33333 11.3333 7.33333C10.0908 7.33333 9.04671 6.48349 8.75068 5.33333H2C1.63181 5.33333 1.33333 5.03486 1.33333 4.66667C1.33333 4.29848 1.63181 4 2 4H8.75068ZM4.66667 8.66667C3.93029 8.66667 3.33333 9.26362 3.33333 10C3.33333 10.7364 3.93029 11.3333 4.66667 11.3333C5.40305 11.3333 6 10.7364 6 10C6 9.26362 5.40305 8.66667 4.66667 8.66667ZM2 10C2 8.52724 3.19391 7.33333 4.66667 7.33333C5.90923 7.33333 6.95329 8.18318 7.24932 9.33333H14C14.3682 9.33333 14.6667 9.63181 14.6667 10C14.6667 10.3682 14.3682 10.6667 14 10.6667H7.24932C6.95329 11.8168 5.90923 12.6667 4.66667 12.6667C3.19391 12.6667 2 11.4728 2 10Z"
        fill="currentColor"
      />
    </svg>
  )
}

const primaryTabs = [
  { id: "overview", label: "Overview", target: "overview" as const },
  { id: "invoices", label: "Invoices & estimates" },
  { id: "docs", label: "Docs & contracts" },
  { id: "subscriptions", label: "Subscriptions", target: "subscriptions" as const },
  { id: "products", label: "Products" },
  {
    id: "integrations",
    label: "Integrations",
    target: "integrations" as const,
    internalHref: getIntegrationsHubPath(),
  },
] as const

type PrimaryTab = (typeof primaryTabs)[number]

function primaryTabClassName(isActive: boolean) {
  return cn(
    "inline-flex h-10 shrink-0 items-center border-b-2 px-2 text-base leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40",
    isActive
      ? "border-[#004eeb] font-semibold text-[#004eeb]"
      : "border-transparent font-medium text-[#667085] hover:text-[#101828]"
  )
}

function getActiveTabId(pathname: string): PrimaryTab["id"] {
  if (pathname === "/integrations" || pathname.startsWith("/integrations/")) {
    return "integrations"
  }
  return "overview"
}

/**
 * Settings sub-pages (e.g. /integrations/razorpay) render their own page header
 * and don't need the global "Payment integrations" sub-bar.
 */
function isIntegrationSettingsRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/integrations/") && pathname !== "/integrations"
  )
}

/** LeadConnector app manage screens use a focused layout without Payments tabs. */
function shouldHidePaymentsPrimaryNav(pathname: string): boolean {
  return pathname === "/integrations/razorpay/manage"
}

const STATUS_TABS: { id: IntegrationStatusTab; label: string }[] = [
  { id: "connected", label: "Connected" },
  { id: "all", label: "All providers" },
]

export function Topbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [navUrls, setNavUrls] = useState<PaymentsHubNavUrls>({
    overview: PAYMENTS_HUB_DEFAULTS.overview,
    subscriptions: PAYMENTS_HUB_DEFAULTS.subscriptions,
    integrations: PAYMENTS_HUB_DEFAULTS.integrations || getIntegrationsHubPath(),
  })
  const activeTabId = getActiveTabId(pathname)
  const showIntegrationsSubHeader = !isIntegrationSettingsRoute(pathname)
  const hidePaymentsPrimaryNav = shouldHidePaymentsPrimaryNav(pathname)
  const { isConnected } = useIntegrationStatus()
  const connectedCount = INTEGRATIONS.reduce(
    (count, item) => (isConnected(item.id) ? count + 1 : count),
    0
  )
  const activeStatusTab = resolveIntegrationStatusTab(
    searchParams.get("status"),
    connectedCount > 0
  )

  useEffect(() => {
    setNavUrls(resolvePaymentsHubNavUrls("integrations"))
  }, [pathname])

  return (
    <header className="w-full min-w-0 bg-white">
      <div className="flex w-full min-w-0 flex-col gap-0">
        {/* Row 1 — Primary header */}
        <div className="relative border-b border-[#d0d5dd] bg-white">
          <div className="flex w-full flex-col gap-3 px-4 py-2 md:h-10 md:flex-row md:items-stretch md:justify-between md:gap-12 md:py-0">
            {hidePaymentsPrimaryNav ? (
              <div className="min-w-0 flex-1" aria-hidden />
            ) : (
              <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-3">
                <h1 className="shrink-0 text-xl font-semibold leading-[30px] tracking-normal text-[#101828]">
                  Payments
                </h1>
                <nav
                  className="flex min-h-0 min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  aria-label="Payments sections"
                >
                  {primaryTabs.map((tab) => {
                    const isActive = tab.id === activeTabId
                    const label = (
                      <span className="whitespace-nowrap">{tab.label}</span>
                    )

                    if ("internalHref" in tab && tab.internalHref) {
                      return (
                        <Link
                          key={tab.id}
                          href={tab.internalHref}
                          aria-current={isActive ? "page" : undefined}
                          className={primaryTabClassName(isActive)}
                        >
                          {label}
                        </Link>
                      )
                    }

                    if ("target" in tab && tab.target) {
                      return (
                        <a
                          key={tab.id}
                          href={navUrls[tab.target]}
                          className={primaryTabClassName(isActive)}
                        >
                          {label}
                        </a>
                      )
                    }

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        className={primaryTabClassName(isActive)}
                      >
                        {label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            )}

            <div
              className="flex h-full shrink-0 items-center gap-3"
              aria-label="Global header actions"
            >
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg p-1.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
                aria-label="Phone"
              >
                <span className="relative flex size-5 items-center justify-center rounded-full bg-[#34d399]">
                  <Phone className="size-3 text-white" strokeWidth={2} />
                </span>
              </button>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg p-1.5 text-[#667085] hover:bg-slate-50 hover:text-[#101828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
                aria-label="Announcements"
              >
                <Megaphone className="size-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg p-1.5 text-[#667085] hover:bg-slate-50 hover:text-[#101828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
                aria-label="Help"
              >
                <HelpCircle className="size-5" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="relative flex size-8 items-center justify-center rounded-lg p-1.5 text-[#667085] hover:bg-slate-50 hover:text-[#101828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
                aria-label="Notifications"
              >
                <Bell className="size-5" strokeWidth={2} />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#f56565]" />
              </button>
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d9d6fe] text-sm font-medium leading-5 text-[#475467]"
                aria-hidden
              >
                SG
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — Figma Header (3334:36853). Hidden on integration settings sub-routes.
            Tabs only appear once at least one provider is connected. */}
        {showIntegrationsSubHeader ? (
          <div className="flex h-[62px] w-full items-center gap-3 border-b border-[#d0d5dd] bg-white px-4">
            <div className="flex shrink-0 items-center gap-1">
              <h2 className="whitespace-nowrap font-[family-name:var(--font-inter)] text-base font-semibold leading-6 tracking-normal text-[#101828]">
                Payment integrations
              </h2>
            </div>

            {connectedCount > 0 ? (
              <nav
                aria-label="Integration status"
                className="flex min-h-0 min-w-0 flex-1 items-stretch gap-2 self-stretch overflow-hidden"
              >
                {STATUS_TABS.map((tab) => {
                  const isActive = tab.id === activeStatusTab
                  const href =
                    tab.id === "connected"
                      ? "/integrations?status=connected"
                      : "/integrations?status=all"

                  return (
                    <Link
                      key={tab.id}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 border-b-2 px-2 font-[family-name:var(--font-inter)] text-base leading-6 outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#84adff]",
                        isActive
                          ? "border-[#004eeb] font-semibold text-[#004eeb]"
                          : "border-transparent font-medium text-[#475467] hover:text-[#101828]"
                      )}
                    >
                      <span className="whitespace-nowrap">{tab.label}</span>
                      {tab.id === "connected" ? (
                        <span
                          className={cn(
                            "inline-flex min-h-[18px] items-center justify-center rounded px-1.5 font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
                            isActive
                              ? "bg-[#eff4ff] text-[#004eeb]"
                              : "bg-[#f2f4f7] text-[#475467]"
                          )}
                          aria-label={`${connectedCount} connected providers`}
                        >
                          {connectedCount}
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
              </nav>
            ) : (
              <div className="min-h-0 min-w-0 flex-1 self-stretch" aria-hidden />
            )}

            <div className="flex shrink-0 items-center gap-2 self-stretch py-3">
              {connectedCount > 0 ? (
                <span
                  aria-hidden
                  className="h-full w-px shrink-0 bg-[#eaecf0]"
                />
              ) : null}
              <Link
                href="/integrations/configure"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded border border-[#155eef] bg-[#155eef] px-2.5 py-1.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:border-[#004eeb] hover:bg-[#004eeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40"
              >
                <Settings04Icon className="text-white" />
                Configure providers
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
