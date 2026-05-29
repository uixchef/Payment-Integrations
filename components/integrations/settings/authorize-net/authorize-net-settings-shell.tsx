"use client"

import { useState } from "react"
import { LogOut, Star } from "lucide-react"
import { IntegrationSettingsSubHeader } from "@/components/integrations/settings/integration-settings-sub-header"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Separator } from "@/components/ui/separator"
import {
  SettingsActionRow,
  SettingsCard,
  SettingsCardDivider,
  SettingsCardTitle,
  SettingsToggleRow,
} from "@/components/integrations/settings/account-settings-card"
import {
  AuthorizeNetSettingsForm,
  type AuthorizeNetFormState,
} from "@/components/integrations/settings/authorize-net-settings-form"
import { QuickStartGuide } from "@/components/integrations/settings/quick-start-guide"
import {
  AUTHORIZE_NET_DOCS,
  INITIAL_AUTHORIZE_NET,
  SEEDED_AUTHORIZE_NET,
} from "@/lib/authorize-net-config-data"
import type { IntegrationItem } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP,
  DISCONNECT_ACCOUNT_DESCRIPTION,
  getSetAsDefaultDisabledReason,
  getSetAsDefaultTooltip,
} from "@/lib/set-as-default-tooltip"
import { cn } from "@/lib/utils"

export function AuthorizeNetSettingsShell({ item }: { item: IntegrationItem }) {
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

  const [form, setForm] = useState<AuthorizeNetFormState>(() =>
    isConnectedFromStatus("authorize-net")
      ? SEEDED_AUTHORIZE_NET
      : INITIAL_AUTHORIZE_NET
  )
  const [showSwitchDefaultModal, setShowSwitchDefaultModal] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)

  const canSave =
    form.loginId.trim().length > 0 &&
    form.transactionKey.trim().length > 0 &&
    form.signatureKey.trim().length > 0

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

  const handleDisconnect = () => {
    setConnected(item.id, false)
    setForm(INITIAL_AUTHORIZE_NET)
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
                <AuthorizeNetSettingsForm
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

                    <SettingsActionRow
                      title="Disconnect this Authorize.net account"
                      description={DISCONNECT_ACCOUNT_DESCRIPTION}
                      icon={
                        <LogOut className="size-5" strokeWidth={1.75} aria-hidden />
                      }
                      buttonLabel="Disconnect"
                      buttonVariant="destructive"
                      buttonDisabled={isDefault}
                      buttonTooltip={DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP}
                      onAction={() => setShowDisconnectModal(true)}
                    />
                  </SettingsCard>
                ) : null}
              </div>

              <QuickStartGuide
                providerId={item.id}
                documentationHref={AUTHORIZE_NET_DOCS}
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

      <ConfirmationDialog
        open={showDisconnectModal}
        onOpenChange={setShowDisconnectModal}
        title={`Disconnect ${item.name} account`}
        description={
          <>
            <p>
              Disconnecting an account may impact your saved methods, including
              payment cards, bank accounts, and any related flows or
              automations.
            </p>
            <p>
              Are you certain you want to proceed with deleting this account?
            </p>
          </>
        }
        confirmLabel="Disconnect"
        cancelLabel="Cancel"
        variant="destructive"
        icon={<LogOut className="size-6" strokeWidth={1.75} aria-hidden />}
        onConfirm={handleDisconnect}
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
