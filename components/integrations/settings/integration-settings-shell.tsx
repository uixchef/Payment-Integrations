"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Separator } from "@/components/ui/separator"
import {
  AuthorizeNetSettingsForm,
  type AuthorizeNetFormState,
} from "@/components/integrations/settings/authorize-net-settings-form"
import { QuickStartGuide } from "@/components/integrations/settings/quick-start-guide"
import { SetAsDefaultButton } from "@/components/integrations/settings/set-as-default-button"
import {
  RazorpaySettingsForm,
  type RazorpayFormState,
} from "@/components/integrations/settings/razorpay-settings-form"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import type { IntegrationItem } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  getSetAsDefaultDisabledReason,
  getSetAsDefaultTooltip,
} from "@/lib/set-as-default-tooltip"
import { cn } from "@/lib/utils"

const PROVIDER_DOCS: Record<string, string> = {
  razorpay:
    "https://help.gohighlevel.com/support/solutions/articles/48000980323-razorpay-integration",
  "authorize-net":
    "https://help.gohighlevel.com/support/solutions/articles/48000980324-authorize-net-integration",
}

function SubHeader({
  item,
  isConnected,
  isDefault,
  onSetAsDefault,
}: {
  item: IntegrationItem
  isConnected: boolean
  isDefault: boolean
  onSetAsDefault: () => void
}) {
  const logo = item.logo ?? INTEGRATION_ASSETS.logos.placeholder
  const setAsDefaultState = getSetAsDefaultDisabledReason({
    isConnected,
    isDefault,
  })
  const setAsDefaultTooltip = getSetAsDefaultTooltip({
    providerName: item.name,
    disabled: setAsDefaultState.disabled,
    reason: setAsDefaultState.reason,
  })

  return (
    <header className="flex h-[62px] shrink-0 items-center gap-3 border-b border-[#d0d5dd] bg-white px-4">
      <Link
        href="/integrations"
        aria-label="Back to integrations"
        className="flex size-6 shrink-0 items-center justify-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
      </Link>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded">
          <Image
            src={logo}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="size-6 object-contain"
            aria-hidden
          />
        </span>
        <h1 className="truncate font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          {item.name} integration settings
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SetAsDefaultButton
          disabled={setAsDefaultState.disabled}
          tooltip={setAsDefaultTooltip}
          onClick={onSetAsDefault}
        />
      </div>
    </header>
  )
}

type FooterAction =
  | { kind: "primary"; label: string; disabled: boolean; onClick: () => void }
  | { kind: "destructive"; label: string; onClick: () => void }

function ContentFooter({ action }: { action: FooterAction }) {
  return (
    <footer className="flex flex-col gap-3 pt-0">
      <Separator className="bg-[#eaecf0]" />
      <div className="flex items-center justify-end px-6 pb-3">
        {action.kind === "primary" ? (
          <Button
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className={cn(
              "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
              "bg-[#155eef] hover:bg-[#004eeb]",
              "disabled:bg-[#b2ccff] disabled:text-white disabled:opacity-100"
            )}
          >
            {action.label}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={action.onClick}
            className={cn(
              "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 shadow-none",
              "border-[#fda29b] bg-white text-[#b42318] shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
              "hover:border-[#f97066] hover:bg-[#fef3f2] hover:text-[#b42318]"
            )}
          >
            {action.label}
          </Button>
        )}
      </div>
    </footer>
  )
}

const INITIAL_RAZORPAY: RazorpayFormState = {
  mode: "live",
  keyId: "",
  secret: "",
  billing: "fixed",
}

const SEEDED_RAZORPAY: RazorpayFormState = {
  mode: "live",
  keyId: "rzp_live_K8pX2J9aQ4mNvW",
  secret: "5xQ7Lm2RtY8nZv4WbCp9Fj3K",
  billing: "fixed",
}

const INITIAL_AUTHORIZE_NET: AuthorizeNetFormState = {
  mode: "live",
  loginId: "",
  transactionKey: "",
  signatureKey: "",
}

const SEEDED_AUTHORIZE_NET: AuthorizeNetFormState = {
  mode: "live",
  loginId: "9pX2vQ4Tn",
  transactionKey: "5KmRtY8wZb2NvCp9Fj3LqHsXdA",
  signatureKey:
    "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2",
}

export function IntegrationSettingsShell({ item }: { item: IntegrationItem }) {
  const {
    isConnected: isConnectedFromStatus,
    isDefault: isDefaultFromStatus,
    defaultProviderId,
    getDefaultProviderName,
    setConnected,
    setDefaultProvider,
  } = useIntegrationStatus()

  const isConnected = isConnectedFromStatus(item.id)
  const isDefault = isDefaultFromStatus(item.id)
  const currentDefaultName = getDefaultProviderName()
  const otherDefaultProviderId =
    defaultProviderId && defaultProviderId !== item.id ? defaultProviderId : null

  const [isReconnecting, setIsReconnecting] = useState(false)
  const [showSwitchDefaultModal, setShowSwitchDefaultModal] = useState(false)
  const [razorpayForm, setRazorpayForm] = useState<RazorpayFormState>(() =>
    item.id === "razorpay" && isConnectedFromStatus("razorpay")
      ? SEEDED_RAZORPAY
      : INITIAL_RAZORPAY
  )
  const [authorizeNetForm, setAuthorizeNetForm] = useState<AuthorizeNetFormState>(
    () =>
      item.id === "authorize-net" && isConnectedFromStatus("authorize-net")
        ? SEEDED_AUTHORIZE_NET
        : INITIAL_AUTHORIZE_NET
  )

  const canSaveRazorpay =
    razorpayForm.keyId.trim().length > 0 &&
    razorpayForm.secret.trim().length > 0

  const canSaveAuthorizeNet =
    authorizeNetForm.loginId.trim().length > 0 &&
    authorizeNetForm.transactionKey.trim().length > 0 &&
    authorizeNetForm.signatureKey.trim().length > 0

  const handleConnect = () => {
    if (item.id === "razorpay" && canSaveRazorpay) {
      setConnected(item.id, true)
    }
    if (item.id === "authorize-net" && canSaveAuthorizeNet) {
      setConnected(item.id, true)
      setIsReconnecting(false)
    }
  }

  const handleReconnect = () => {
    setIsReconnecting(true)
  }

  const handleSaveReconnect = () => {
    if (!canSaveAuthorizeNet) return
    setIsReconnecting(false)
  }

  const handleSetAsDefault = () => {
    if (!isConnected || isDefault) return
    if (otherDefaultProviderId) {
      setShowSwitchDefaultModal(true)
      return
    }
    setDefaultProvider(item.id)
  }

  const handleConfirmSwitchDefault = () => {
    setDefaultProvider(item.id)
  }

  const handleManage = () => {
    // Destination screens will be wired when provided.
  }

  const footerAction: FooterAction = (() => {
    if (item.id === "authorize-net") {
      if (!isConnected) {
        return {
          kind: "primary",
          label: "Save",
          disabled: !canSaveAuthorizeNet,
          onClick: handleConnect,
        }
      }

      if (isReconnecting) {
        return {
          kind: "primary",
          label: "Save",
          disabled: !canSaveAuthorizeNet,
          onClick: handleSaveReconnect,
        }
      }

      return {
        kind: "primary",
        label: "Reconnect",
        disabled: false,
        onClick: handleReconnect,
      }
    }

    if (isConnected) {
      return {
        kind: "primary",
        label: "Manage",
        disabled: false,
        onClick: handleManage,
      }
    }

    return {
      kind: "primary",
      label: "Connect",
      disabled: !canSaveRazorpay,
      onClick: handleConnect,
    }
  })()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SubHeader
        item={item}
        isConnected={isConnected}
        isDefault={isDefault}
        onSetAsDefault={handleSetAsDefault}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-[1080px] gap-10">
              <div className="flex w-full max-w-[656px] min-w-0 flex-1 justify-start">
                {item.id === "razorpay" ? (
                  <RazorpaySettingsForm
                    isConnected={isConnected}
                    isDefault={isDefault}
                    state={razorpayForm}
                    onStateChange={setRazorpayForm}
                  />
                ) : null}
                {item.id === "authorize-net" ? (
                  <AuthorizeNetSettingsForm
                    isConnected={isConnected}
                    isDefault={isDefault}
                    isReconnecting={isReconnecting}
                    state={authorizeNetForm}
                    onStateChange={setAuthorizeNetForm}
                  />
                ) : null}
              </div>
              <QuickStartGuide
                providerId={item.id}
                documentationHref={PROVIDER_DOCS[item.id]}
                isConnected={isConnected}
              />
            </div>
          </div>

          <ContentFooter action={footerAction} />
        </div>
      </div>

      <ConfirmationDialog
        open={showSwitchDefaultModal}
        onOpenChange={setShowSwitchDefaultModal}
        title="Switch default payment provider?"
        description={
          currentDefaultName ? (
            <>
              <strong className="font-semibold text-[#101828]">
                {currentDefaultName}
              </strong>{" "}
              is currently the default. Switching to{" "}
              <strong className="font-semibold text-[#101828]">{item.name}</strong>{" "}
              will route new transactions through it instead.
            </>
          ) : (
            <>
              Set <strong className="font-semibold text-[#101828]">{item.name}</strong>{" "}
              as the default provider for new transactions?
            </>
          )
        }
        confirmLabel="Switch default"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleConfirmSwitchDefault}
      />
    </div>
  )
}
