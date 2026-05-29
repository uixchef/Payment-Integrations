"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  LogOut,
  MoreHorizontal,
} from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddAccountButton } from "@/components/integrations/settings/add-account-button"
import { AddStripeAccountDialog } from "@/components/integrations/settings/stripe/add-stripe-account-dialog"
import {
  StripeAccountConfig,
  type StripeAccount,
} from "@/components/integrations/settings/stripe/stripe-account-config"
import { useStripeAccounts } from "@/components/integrations/settings/stripe/stripe-accounts-context"
import { StripeEmptyState } from "@/components/integrations/settings/stripe/stripe-empty-state"
import { StripeGuide } from "@/components/integrations/settings/stripe/stripe-guide"
import { StripeSyncCard } from "@/components/integrations/settings/stripe/stripe-sync-card"
import { StripeSyncImportingModal } from "@/components/integrations/settings/stripe/sync/stripe-sync-importing-modal"
import { STRIPE_SYNC_COUNTS } from "@/components/integrations/settings/stripe/sync/sync-mock-data"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { getAddAccountButtonState } from "@/lib/integration-account-limits"
import {
  DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP,
  DISCONNECT_ACCOUNT_DESCRIPTION,
  getSetAsDefaultDisabledReason,
  getSetAsDefaultTooltip,
} from "@/lib/set-as-default-tooltip"
import type { IntegrationItem } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import { cn } from "@/lib/utils"

/** Beyond this count the trailing tabs collapse into a "more" dropdown. */
const MAX_VISIBLE_TABS = 3

function splitVisibility(
  accounts: StripeAccount[],
  activeId: string | null
): { visible: StripeAccount[]; overflow: StripeAccount[] } {
  if (accounts.length <= MAX_VISIBLE_TABS) {
    return { visible: accounts, overflow: [] }
  }

  const visible = accounts.slice(0, MAX_VISIBLE_TABS)
  const overflow = accounts.slice(MAX_VISIBLE_TABS)

  const activeIdxInOverflow = overflow.findIndex((a) => a.id === activeId)
  if (activeIdxInOverflow < 0) {
    return { visible, overflow }
  }

  const activeAccount = overflow[activeIdxInOverflow]
  const displaced = visible[visible.length - 1]
  const nextVisible = [...visible.slice(0, -1), activeAccount]
  const nextOverflow = [
    displaced,
    ...overflow.filter((_, i) => i !== activeIdxInOverflow),
  ]
  return { visible: nextVisible, overflow: nextOverflow }
}

export function StripeSettingsShell({ item }: { item: IntegrationItem }) {
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

  const {
    accounts,
    activeAccount,
    activeAccountId,
    defaultAccountId,
    setActiveAccountId,
    setDefaultAccountId,
    ensureSeededOnConnect,
    completeActiveAccountOAuth,
    addPendingAccount,
    renameActiveAccount,
    updateActiveAccount,
    removeActiveAccount,
    getAccountSyncState,
    clearAccountSync,
  } = useStripeAccounts()

  const [showSwitchDefaultModal, setShowSwitchDefaultModal] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [accountDialogMode, setAccountDialogMode] = useState<
    "add" | "edit" | null
  >(null)
  const [importingModalOpen, setImportingModalOpen] = useState(false)

  const syncState = getAccountSyncState(activeAccountId)
  const stripeLogo = item.logo ?? INTEGRATION_ASSETS.logos.stripe

  const activeIsDefaultAccount =
    isDefault && activeAccountId !== null && activeAccountId === defaultAccountId

  const setAsDefaultState = getSetAsDefaultDisabledReason({
    multiAccount: true,
    isConnected,
    isDefault,
    activeAccountConnected: Boolean(activeAccount?.connected),
    activeIsDefaultAccount,
  })
  const setAsDefaultTooltip = getSetAsDefaultTooltip({
    providerName: item.name,
    multiAccount: true,
    disabled: setAsDefaultState.disabled,
    reason: setAsDefaultState.reason,
  })

  const handleConnect = () => {
    if (accounts.length === 0) {
      ensureSeededOnConnect()
      setConnected(item.id, true)
      return
    }
    if (completeActiveAccountOAuth()) {
      setConnected(item.id, true)
    }
  }

  const handleAddAccount = (label: string) => {
    addPendingAccount(label)
  }

  const handleRenameActiveAccount = (label: string) => {
    renameActiveAccount(label)
  }

  const handleDisconnect = () => {
    const { remainingCount } = removeActiveAccount()
    if (remainingCount === 0) {
      setConnected(item.id, false)
    }
  }

  const handleSetAsDefaultChange = (checked: boolean) => {
    if (!activeAccount?.connected) return

    if (!checked) {
      if (activeAccountId === defaultAccountId) {
        setDefaultAccountId(null)
      }
      if (isDefault) {
        clearDefaultProvider()
      }
      return
    }

    if (!isDefault && otherDefaultProviderId) {
      setShowSwitchDefaultModal(true)
      return
    }

    setDefaultAccountId(activeAccountId)
    if (!isDefault) {
      setDefaultProvider(item.id)
    }
  }

  const handleConfirmSwitchDefault = () => {
    setDefaultProvider(item.id)
    setDefaultAccountId(activeAccountId)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SubHeader
        item={item}
        accounts={accounts}
        activeAccountId={activeAccountId}
        defaultAccountId={defaultAccountId}
        isConnected={isConnected}
        isDefault={isDefault}
        onSelectAccount={setActiveAccountId}
        onAddAccount={() => setAccountDialogMode("add")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-[1180px] gap-10">
              <div className="flex w-full max-w-[756px] min-w-0 flex-1 justify-start">
                {activeAccount?.connected ? (
                  <StripeAccountConfig
                    account={activeAccount}
                    isDefaultAccount={activeIsDefaultAccount}
                    setAsDefaultChecked={activeIsDefaultAccount}
                    setAsDefaultDisabled={setAsDefaultState.disabled}
                    setAsDefaultTooltip={setAsDefaultTooltip}
                    disconnectDisabled={activeIsDefaultAccount}
                    disconnectTooltip={DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP}
                    disconnectDescription={DISCONNECT_ACCOUNT_DESCRIPTION}
                    onModeChange={(mode) => updateActiveAccount({ mode })}
                    onApplePayChange={(applePayEnabled) =>
                      updateActiveAccount({ applePayEnabled })
                    }
                    onSetAsDefaultChange={handleSetAsDefaultChange}
                    onOpenPaymentMethods={() =>
                      router.push("/integrations/stripe/payment-methods")
                    }
                    onEditAccount={() => setAccountDialogMode("edit")}
                    onDisconnect={() => setShowDisconnectModal(true)}
                  />
                ) : (
                  <StripeEmptyState
                    onWatchVideo={() => {
                      window.open(
                        "https://www.youtube.com/results?search_query=stripe+setup",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }}
                    onConnect={handleConnect}
                  />
                )}
              </div>

              <div className="flex flex-col gap-6">
                <StripeSyncCard
                  enabled={Boolean(activeAccount?.connected)}
                  syncState={syncState}
                  onViewDetails={() => {
                    if (syncState?.status === "in-progress") {
                      setImportingModalOpen(true)
                      return
                    }
                    if (syncState?.status === "completed") {
                      router.push("/integrations/stripe/sync?view=results")
                    }
                  }}
                  onResync={() => {
                    if (activeAccountId) clearAccountSync(activeAccountId)
                    router.push("/integrations/stripe/sync")
                  }}
                  onSync={() => {
                    /* mock: trigger a real Stripe sync here */
                  }}
                />
                <StripeGuide isConnected={Boolean(activeAccount?.connected)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddStripeAccountDialog
        open={accountDialogMode !== null}
        mode={accountDialogMode ?? "add"}
        initialValue={
          accountDialogMode === "edit" ? activeAccount?.label ?? "" : ""
        }
        onOpenChange={(open) => {
          if (!open) setAccountDialogMode(null)
        }}
        onConfirm={(label) => {
          if (accountDialogMode === "add") {
            handleAddAccount(label)
          } else if (accountDialogMode === "edit") {
            handleRenameActiveAccount(label)
          }
        }}
      />

      <StripeSyncImportingModal
        open={importingModalOpen}
        onOpenChange={setImportingModalOpen}
        logo={stripeLogo}
        summary={
          syncState && syncState.status !== "incomplete"
            ? syncState.summary
            : {
                subscriptions: STRIPE_SYNC_COUNTS.subscriptions,
                contacts: STRIPE_SYNC_COUNTS.contacts,
                paymentMethods: STRIPE_SYNC_COUNTS.notEligible,
              }
        }
      />

      <ConfirmationDialog
        open={showDisconnectModal}
        onOpenChange={setShowDisconnectModal}
        title={`Disconnect ${activeAccount?.label ?? "account"}`}
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

function SubHeader({
  item,
  accounts,
  activeAccountId,
  defaultAccountId,
  isConnected,
  isDefault,
  onSelectAccount,
  onAddAccount,
}: {
  item: IntegrationItem
  accounts: StripeAccount[]
  activeAccountId: string | null
  defaultAccountId: string | null
  isConnected: boolean
  isDefault: boolean
  onSelectAccount: (id: string) => void
  onAddAccount: () => void
}) {
  const addAccountState = getAddAccountButtonState({
    accountsCount: accounts.length,
    hasConnectedAccount: accounts.some((account) => account.connected),
  })
  const logo = item.logo ?? INTEGRATION_ASSETS.logos.placeholder
  const showAccountTabs = isConnected && accounts.length > 0
  const { visible: visibleAccounts, overflow: overflowAccounts } =
    splitVisibility(accounts, activeAccountId)

  return (
    <header className="flex h-[62px] shrink-0 items-stretch gap-3 bg-white px-4 shadow-[inset_0_-1px_0_#d0d5dd]">
      <Link
        href="/integrations"
        aria-label="Back to integrations"
        className="flex size-6 shrink-0 items-center justify-center self-center rounded text-[#101828] outline-none transition-colors hover:bg-[#f2f4f7] focus-visible:ring-2 focus-visible:ring-[#84adff]"
      >
        <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden />
      </Link>
      <div className="flex min-w-0 items-center gap-1 self-center">
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

      {showAccountTabs ? (
        <div className="flex h-[62px] min-w-0 flex-1 items-center gap-2">
          <div className="flex h-full min-w-0 items-center gap-2 overflow-x-auto">
            {visibleAccounts.map((account) => {
              const active = account.id === activeAccountId
              const isAccountDefault =
                isDefault && account.id === defaultAccountId
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => onSelectAccount(account.id)}
                  className={cn(
                    "inline-flex h-full max-w-[180px] items-center gap-1 border-b-2 px-2 py-1",
                    "font-[family-name:var(--font-inter)] text-base font-medium leading-6 outline-none transition-colors",
                    "focus-visible:bg-[#f9fafb]",
                    active
                      ? "border-[#004eeb] font-semibold text-[#004eeb]"
                      : "border-transparent text-[#475467] hover:text-[#101828]"
                  )}
                  aria-current={active ? "page" : undefined}
                  title={account.label}
                >
                  <span className="truncate">{account.label}</span>
                  {isAccountDefault ? <DefaultBadge active={active} /> : null}
                </button>
              )
            })}
          </div>

          <VerticalDivider />

          {overflowAccounts.length > 0 ? (
            <>
              <MoreAccountsMenu
                accounts={overflowAccounts}
                defaultAccountId={defaultAccountId}
                isDefault={isDefault}
                onSelectAccount={onSelectAccount}
              />
              <VerticalDivider />
            </>
          ) : null}

          <AddAccountButton
            disabled={addAccountState.disabled}
            disabledReason={addAccountState.disabledReason}
            onAddAccount={onAddAccount}
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </header>
  )
}

function DefaultBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center justify-center rounded px-1.5",
        "font-[family-name:var(--font-inter)] text-sm font-medium leading-5",
        active
          ? "bg-[#eff4ff] text-[#004eeb]"
          : "bg-[#f2f4f7] text-[#475467]"
      )}
    >
      Default
    </span>
  )
}

function MoreAccountsMenu({
  accounts,
  defaultAccountId,
  isDefault,
  onSelectAccount,
}: {
  accounts: StripeAccount[]
  defaultAccountId: string | null
  isDefault: boolean
  onSelectAccount: (id: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Show ${accounts.length} more account${accounts.length === 1 ? "" : "s"}`}
          className={cn(
            "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded",
            "text-[#475467] outline-none transition-colors",
            "hover:bg-[#f2f4f7] hover:text-[#101828]",
            "focus-visible:ring-2 focus-visible:ring-[#84adff]"
          )}
        >
          <MoreHorizontal className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className="min-w-[180px]">
        {accounts.map((account) => {
          const isAccountDefault =
            isDefault && account.id === defaultAccountId
          return (
            <DropdownMenuItem
              key={account.id}
              onSelect={() => onSelectAccount(account.id)}
              className="flex items-center justify-between gap-2"
            >
              <span className="truncate">{account.label}</span>
              {isAccountDefault ? <DefaultBadge active={false} /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function VerticalDivider() {
  return (
    <span
      aria-hidden
      className="block h-6 w-px shrink-0 self-center bg-[#eaecf0]"
    />
  )
}
