"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings2, Star } from "lucide-react"
import { IntegrationSettingsSubHeader } from "@/components/integrations/settings/integration-settings-sub-header"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Separator } from "@/components/ui/separator"
import {
  SettingsCard,
  SettingsCardDivider,
  SettingsCardTitle,
  SettingsPrimaryActionRow,
  SettingsToggleRow,
} from "@/components/integrations/settings/account-settings-card"
import {
  RazorpaySettingsForm,
  type RazorpayFormState,
} from "@/components/integrations/settings/razorpay-settings-form"
import { QuickStartGuide } from "@/components/integrations/settings/quick-start-guide"
import type { IntegrationItem } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  INITIAL_RAZORPAY,
  RAZORPAY_DOCS,
  SEEDED_RAZORPAY,
} from "@/lib/razorpay-config-data"
import {
  getSetAsDefaultDisabledReason,
  getSetAsDefaultTooltip,
} from "@/lib/set-as-default-tooltip"
import { cn } from "@/lib/utils"

export function RazorpaySettingsShell({ item }: { item: IntegrationItem }) {
  const router = useRouter()
  const {
    isConnected: isConnectedFromStatus,
    isDefault: isDefaultFromStatus,
    defaultProviderId,
    getDefaultProviderName,
    setConnected,
    setDefaultProvider,
    clearDefaultProvider,
  } = useIntegrationStatus()

  const isConnected = isConnectedFromStatus(item.id)
  const isDefault = isDefaultFromStatus(item.id)
  const currentDefaultName = getDefaultProviderName()
  const otherDefaultProviderId =
    defaultProviderId && defaultProviderId !== item.id ? defaultProviderId : null

  const [form, setForm] = useState<RazorpayFormState>(() =>
    isConnectedFromStatus("razorpay") ? SEEDED_RAZORPAY : INITIAL_RAZORPAY
  )
  const [showSwitchDefaultModal, setShowSwitchDefaultModal] = useState(false)

  const canSave =
    form.keyId.trim().length > 0 && form.secret.trim().length > 0

  const setAsDefaultState = getSetAsDefaultDisabledReason({
    multiAccount: true,
    isConnected,
    isDefault,
    activeAccountConnected: isConnected,
    activeIsDefaultAccount: isDefault,
  })
  const setAsDefaultTooltip = getSetAsDefaultTooltip({
    providerName: item.name,
    multiAccount: true,
    disabled: setAsDefaultState.disabled,
    reason: setAsDefaultState.reason,
  })

  const handleSave = () => {
    if (canSave) {
      setConnected(item.id, true)
    }
  }

  const handleManage = () => {
    router.push("/integrations/razorpay/manage")
  }

  const handleSetAsDefaultChange = (checked: boolean) => {
    if (!isConnected) return

    if (!checked) {
      if (isDefault) {
        clearDefaultProvider()
      }
      return
    }

    if (!isDefault && otherDefaultProviderId) {
      setShowSwitchDefaultModal(true)
      return
    }

    if (!isDefault) {
      setDefaultProvider(item.id)
    }
  }

  const handleConfirmSwitchDefault = () => {
    setDefaultProvider(item.id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <IntegrationSettingsSubHeader item={item} isDefault={isDefault && isConnected} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-[1180px] gap-10">
              <div className="flex w-full max-w-[756px] min-w-0 flex-1 flex-col gap-6">
                <RazorpaySettingsForm
                  isConnected={isConnected}
                  isDefault={isDefault}
                  state={form}
                  onStateChange={setForm}
                />

                {isConnected ? (
                  <SettingsCard>
                    <SettingsCardTitle>Account settings</SettingsCardTitle>
                    <SettingsCardDivider />

                    <SettingsToggleRow
                      title="Use as default payment method"
                      description="New payments and invoices use this account when nothing else is specified."
                      icon={
                        <Star className="size-5" strokeWidth={1.75} aria-hidden />
                      }
                      checked={isDefault}
                      disabled={setAsDefaultState.disabled}
                      tooltip={setAsDefaultTooltip}
                      onCheckedChange={handleSetAsDefaultChange}
                      ariaLabel="Use as default payment method"
                    />

                    <SettingsCardDivider />

                    <SettingsPrimaryActionRow
                      title="Manage in Razorpay"
                      description="Open your Razorpay dashboard to configure payment methods and account settings."
                      icon={
                        <Settings2 className="size-5" strokeWidth={1.75} aria-hidden />
                      }
                      buttonLabel="Manage"
                      onAction={handleManage}
                      buttonClassName="min-w-[104px]"
                    />
                  </SettingsCard>
                ) : null}
              </div>

              <QuickStartGuide
                providerId={item.id}
                documentationHref={RAZORPAY_DOCS}
                isConnected={isConnected}
              />
            </div>
          </div>

          {!isConnected ? (
            <PendingFooter canSave={canSave} onSave={handleSave} />
          ) : null}
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

function PendingFooter({
  canSave,
  onSave,
}: {
  canSave: boolean
  onSave: () => void
}) {
  return (
    <footer className="flex shrink-0 flex-col pb-4 pt-0">
      <Separator className="bg-[#eaecf0]" />
      <div className="flex items-center justify-end px-6 pt-4">
        <Button
          type="button"
          disabled={!canSave}
          onClick={onSave}
          className={cn(
            "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-white",
            "bg-[#155eef] hover:bg-[#004eeb]",
            "disabled:bg-[#b2ccff] disabled:text-white disabled:opacity-100"
          )}
        >
          Save
        </Button>
      </div>
    </footer>
  )
}
