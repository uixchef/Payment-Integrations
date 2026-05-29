"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  LogIn,
  LogOut,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { AddAccountButton } from "@/components/integrations/settings/add-account-button"
import { AddPayPalAccountDialog } from "@/components/integrations/settings/paypal/add-paypal-account-dialog"
import {
  PayPalAccountConfig,
  type PayPalAccount,
} from "@/components/integrations/settings/paypal/paypal-account-config"
import { usePayPalAccounts } from "@/components/integrations/settings/paypal/paypal-accounts-context"
import { PayPalEmptyState } from "@/components/integrations/settings/paypal/paypal-empty-state"
import { PayPalGuide } from "@/components/integrations/settings/paypal/paypal-guide"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { getAddAccountButtonState } from "@/lib/integration-account-limits"
import {
  DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP,
  DISCONNECT_ACCOUNT_DESCRIPTION,
} from "@/lib/set-as-default-tooltip"
import type { IntegrationItem } from "@/lib/integrations-data"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import { cn } from "@/lib/utils"

const MAX_VISIBLE_TABS = 3

function splitVisibility(
  accounts: PayPalAccount[],
  activeId: string | null
): { visible: PayPalAccount[]; overflow: PayPalAccount[] } {
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

export function PayPalSettingsShell({ item }: { item: IntegrationItem }) {
  const router = useRouter()
  const {
    isConnected: isConnectedFromStatus,
    isDefault: isDefaultFromStatus,
    setConnected,
  } = useIntegrationStatus()

  const isConnected = isConnectedFromStatus(item.id)
  const isDefault = isDefaultFromStatus(item.id)

  const {
    accounts,
    activeAccount,
    activeAccountId,
    setActiveAccountId,
    ensureInitialAccount,
    addPendingAccount,
    renameActiveAccount,
    updateActiveAccount,
    connectActiveAccount,
    completeActiveAccountOAuth,
    reconnectActiveAccount,
    removeActiveAccount,
  } = usePayPalAccounts()

  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [showReconnectModal, setShowReconnectModal] = useState(false)
  const [accountDialogMode, setAccountDialogMode] = useState<
    "add" | "edit" | null
  >(null)

  const hasOAuthConnectedAccount = accounts.some(
    (account) => account.connected && account.oauthConnected
  )
  const showOAuthEmptyState = Boolean(
    activeAccount &&
      !activeAccount.connected &&
      (activeAccount.oauthFlow || hasOAuthConnectedAccount)
  )

  const handleSave = () => {
    if (connectActiveAccount()) {
      setConnected(item.id, true)
    }
  }

  const handleConnect = () => {
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
    const remaining = accounts.filter(
      (account) => account.id !== activeAccountId
    )
    removeActiveAccount()

    if (!remaining.some((account) => account.connected)) {
      setConnected(item.id, false)
    }

    if (remaining.length === 0) {
      ensureInitialAccount()
    }
  }

  const handleConfirmReconnect = () => {
    if (!reconnectActiveAccount()) return

    const remainingConnected = accounts.filter(
      (account) =>
        account.id !== activeAccountId && account.connected
    )
    if (remainingConnected.length === 0) {
      setConnected(item.id, false)
    }
  }

  const canSave =
    Boolean(activeAccount?.clientId.trim()) &&
    Boolean(activeAccount?.secretId.trim()) &&
    !activeAccount?.connected

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SubHeader
        item={item}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSelectAccount={setActiveAccountId}
        onAddAccount={() => setAccountDialogMode("add")}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-[1180px] gap-10">
              <div className="flex w-full max-w-[756px] min-w-0 flex-1 justify-start">
                {showOAuthEmptyState ? (
                  <PayPalEmptyState
                    onWatchVideo={() => {
                      window.open(
                        "https://www.youtube.com/results?search_query=paypal+integration+setup",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }}
                    onConnect={handleConnect}
                  />
                ) : activeAccount ? (
                  <PayPalAccountConfig
                    account={activeAccount}
                    isDefaultAccount={isDefault}
                    disconnectDisabled={isDefault}
                    disconnectTooltip={DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP}
                    disconnectDescription={DISCONNECT_ACCOUNT_DESCRIPTION}
                    onModeChange={(mode) => updateActiveAccount({ mode })}
                    onClientIdChange={(clientId) =>
                      updateActiveAccount({ clientId })
                    }
                    onSecretIdChange={(secretId) =>
                      updateActiveAccount({ secretId })
                    }
                    onOpenPaymentMethods={() =>
                      router.push("/integrations/paypal/payment-methods")
                    }
                    onReconnect={() => setShowReconnectModal(true)}
                    onEditAccount={() => setAccountDialogMode("edit")}
                    onDisconnect={() => setShowDisconnectModal(true)}
                  />
                ) : null}
              </div>

              <PayPalGuide isConnected={Boolean(activeAccount?.connected)} />
            </div>
          </div>

          {!activeAccount?.connected && !showOAuthEmptyState ? (
            <PendingFooter canSave={canSave} onSave={handleSave} />
          ) : null}
        </div>
      </div>

      <AddPayPalAccountDialog
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

      <ConfirmationDialog
        open={showReconnectModal}
        onOpenChange={setShowReconnectModal}
        title="Reconnect PayPal integration"
        description="You're about to refresh your PayPal connection. This will update your credentials and ensure ongoing access to payment services with the new flow."
        confirmLabel="Reconnect"
        cancelLabel="Cancel"
        variant="primary"
        icon={<LogIn className="size-6" strokeWidth={1.75} aria-hidden />}
        onConfirm={handleConfirmReconnect}
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
    </div>
  )
}

function SubHeader({
  item,
  accounts,
  activeAccountId,
  onSelectAccount,
  onAddAccount,
}: {
  item: IntegrationItem
  accounts: PayPalAccount[]
  activeAccountId: string | null
  onSelectAccount: (id: string) => void
  onAddAccount: () => void
}) {
  const hasOAuthConnectedAccount = accounts.some(
    (account) => account.connected && account.oauthConnected
  )
  const addAccountState = getAddAccountButtonState({
    accountsCount: accounts.length,
    hasConnectedAccount: hasOAuthConnectedAccount,
    requireConnectedBeforeAdd: true,
  })
  const addAccountDisabledReason =
    addAccountState.disabled &&
    accounts.some(
      (account) => account.connected && !account.oauthConnected
    )
      ? "Reconnect your PayPal account before adding another one."
      : addAccountState.disabledReason
  const logo = item.logo ?? INTEGRATION_ASSETS.logos.placeholder
  const showAccountTabs = accounts.length > 0
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
                </button>
              )
            })}
          </div>

          <VerticalDivider />

          {overflowAccounts.length > 0 ? (
            <>
              <MoreAccountsMenu
                accounts={overflowAccounts}
                onSelectAccount={onSelectAccount}
              />
              <VerticalDivider />
            </>
          ) : null}

          <AddAccountButton
            disabled={addAccountState.disabled}
            disabledReason={addAccountDisabledReason}
            onAddAccount={onAddAccount}
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </header>
  )
}

function MoreAccountsMenu({
  accounts,
  onSelectAccount,
}: {
  accounts: PayPalAccount[]
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
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onSelect={() => onSelectAccount(account.id)}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate">{account.label}</span>
          </DropdownMenuItem>
        ))}
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
