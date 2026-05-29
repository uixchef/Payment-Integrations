"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Separator } from "@/components/ui/separator"
import { RazorpayAuthTab } from "@/components/integrations/settings/razorpay/razorpay-auth-tab"
import type { RazorpayFormState } from "@/components/integrations/settings/razorpay-settings-form"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  INITIAL_RAZORPAY_CONFIG,
  SEEDED_RAZORPAY_CONFIG,
} from "@/lib/razorpay-config-data"
import { cn } from "@/lib/utils"

type ManageTab = "overview" | "authentication"

function AppTab({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative px-1 pb-3 pt-1 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[#84adff]",
        active
          ? "text-[#004eeb] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#004eeb]"
          : "text-[#475467] hover:text-[#344054]"
      )}
    >
      {label}
    </button>
  )
}

export function RazorpayManageShell({ item }: { item: IntegrationItem }) {
  const router = useRouter()
  const { isConnected: isConnectedFromStatus, setConnected } = useIntegrationStatus()
  const isConnected = isConnectedFromStatus(item.id)

  const [activeTab, setActiveTab] = useState<ManageTab>("authentication")
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [config, setConfig] = useState<RazorpayFormState>(() =>
    isConnected ? SEEDED_RAZORPAY_CONFIG : INITIAL_RAZORPAY_CONFIG
  )

  const logo = item.logo ?? INTEGRATION_ASSETS.logos.placeholder

  const canSave =
    config.keyId.trim().length > 0 && config.secret.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    setConnected(item.id, true)
    router.push(`/integrations/${item.id}`)
  }

  const handleDisconnect = () => {
    setConnected(item.id, false)
    setConfig(INITIAL_RAZORPAY_CONFIG)
    router.push(`/integrations/${item.id}`)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
        <div className="shrink-0 border-b border-[#eaecf0] px-6 pb-0 pt-5">
          <Link
            href="/integrations"
            aria-label="Back to integrations"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#004eeb] outline-none transition-colors hover:text-[#155eef] focus-visible:ring-2 focus-visible:ring-[#84adff]"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
            Back
          </Link>

          <div className="mt-5 flex flex-wrap items-start gap-4">
            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#eaecf0] bg-white">
              <Image
                src={logo}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="size-10 object-contain"
                aria-hidden
              />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-[family-name:var(--font-inter)] text-xl font-semibold leading-[30px] text-[#101828]">
                  {item.name} by LeadConnector
                </h1>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1 rounded border border-[#d0d5dd] bg-white px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.05)] outline-none hover:bg-[#f9fafb] focus-visible:ring-2 focus-visible:ring-[#84adff]"
                >
                  Agency view
                  <ChevronDown className="size-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>

              <p className="mt-1 font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
                Easy Razorpay payments for India
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#667085]">
                  Be the first to review
                </span>
                <span className="inline-flex items-center gap-1 font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
                  <Download className="size-4" strokeWidth={1.75} aria-hidden />
                  75
                </span>
                <span className="inline-flex h-6 items-center rounded-xl bg-[#f2f4f7] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#344054]">
                  Free
                </span>
                <span className="inline-flex h-6 items-center rounded-xl bg-[#ecfdf3] px-2 font-[family-name:var(--font-inter)] text-sm font-medium leading-5 text-[#027a48]">
                  White-label verified
                </span>
              </div>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="App sections"
            className="mt-6 flex gap-6 border-b border-[#eaecf0]"
          >
            <AppTab
              active={activeTab === "overview"}
              label="Overview"
              onClick={() => setActiveTab("overview")}
            />
            <AppTab
              active={activeTab === "authentication"}
              label="Authentication"
              onClick={() => setActiveTab("authentication")}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
          {activeTab === "overview" ? (
            <div className="max-w-[720px]">
              <h2 className="font-[family-name:var(--font-inter)] text-xl font-semibold leading-[30px] text-[#101828]">
                Overview
              </h2>
              <p className="mt-2 font-[family-name:var(--font-inter)] text-base leading-6 text-[#475467]">
                Accept cards, wallets, bank transfers, and buy now, pay later
                options through Razorpay for customers in India. Open the
                authentication tab to update credentials and billing settings.
              </p>
            </div>
          ) : (
            <RazorpayAuthTab
              state={config}
              onStateChange={setConfig}
              isConnected={isConnected}
            />
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-3 pt-0">
          <Separator className="bg-[#eaecf0]" />
          <div className="flex items-center justify-end px-6 pb-3">
            {isConnected ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDisconnectModal(true)}
                className={cn(
                  "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 shadow-none",
                  "border-[#fda29b] bg-white text-[#b42318] shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
                  "hover:border-[#f97066] hover:bg-[#fef3f2] hover:text-[#b42318]"
                )}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!canSave}
                onClick={handleSave}
                className={cn(
                  "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
                  "bg-[#155eef] hover:bg-[#004eeb]",
                  "disabled:bg-[#b2ccff] disabled:text-white disabled:opacity-100"
                )}
              >
                Save
              </Button>
            )}
          </div>
        </footer>
      </div>

      <ConfirmationDialog
        open={showDisconnectModal}
        onOpenChange={setShowDisconnectModal}
        title="Disconnect Razorpay?"
        description="This removes the Razorpay connection and stops routing new transactions through this provider."
        confirmLabel="Disconnect"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDisconnect}
      />
    </div>
  )
}
