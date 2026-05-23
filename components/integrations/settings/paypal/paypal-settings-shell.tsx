"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  LogOut,
  MoreHorizontal,
  Pencil,
  Settings2,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AddAccountButton } from "@/components/integrations/settings/add-account-button"
import { SetAsDefaultButton } from "@/components/integrations/settings/set-as-default-button"
import { AddPayPalAccountDialog } from "@/components/integrations/settings/paypal/add-paypal-account-dialog"
import {
  PayPalAccountConfig,
  type PayPalAccount,
} from "@/components/integrations/settings/paypal/paypal-account-config"
import { usePayPalAccounts } from "@/components/integrations/settings/paypal/paypal-accounts-context"
import { PayPalGuide } from "@/components/integrations/settings/paypal/paypal-guide"
import { INTEGRATION_ASSETS } from "@/lib/integration-assets"
import { getAddAccountButtonState } from "@/lib/integration-account-limits"
import {
  getSetAsDefaultDisabledReason,
  getSetAsDefaultTooltip,
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
    isDefault: isDefaultFromStatus,
    defaultProviderId,
    getDefaultProviderName,
    setConnected,
    setDefaultProvider,
  } = useIntegrationStatus()

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
    ensureInitialAccount,
    addPendingAccount,
    renameActiveAccount,
    updateActiveAccount,
    connectActiveAccount,
    removeActiveAccount,
  } = usePayPalAccounts()

  const [showSwitchDefaultModal, setShowSwitchDefaultModal] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const [accountDialogMode, setAccountDialogMode] = useState<
    "add" | "edit" | null
  >(null)

  const handleSave = () => {
    if (connectActiveAccount()) {
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

  const handleSetAsDefault = () => {
    if (!activeAccount?.connected) return
    if (isDefault && activeAccountId === defaultAccountId) return

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

  const canSave =
    Boolean(activeAccount?.clientId.trim()) &&
    Boolean(activeAccount?.secretId.trim()) &&
    !activeAccount?.connected

  const isDefaultAccount =
    isDefault && activeAccountId !== null && activeAccountId === defaultAccountId

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <SubHeader
        item={item}
        accounts={accounts}
        activeAccountId={activeAccountId}
        defaultAccountId={defaultAccountId}
        isDefault={isDefault}
        activeAccountConnected={Boolean(activeAccount?.connected)}
        onSelectAccount={setActiveAccountId}
        onAddAccount={() => setAccountDialogMode("add")}
        onSetAsDefault={handleSetAsDefault}
        onOpenPaymentMethods={() =>
          router.push("/integrations/paypal/payment-methods")
        }
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          <div className="flex min-h-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex w-full max-w-[1080px] gap-10">
              <div className="flex w-full max-w-[656px] min-w-0 flex-1 justify-start">
                {activeAccount ? (
                  <PayPalAccountConfig
                    account={activeAccount}
                    isDefaultAccount={isDefaultAccount}
                    onModeChange={(mode) => updateActiveAccount({ mode })}
                    onClientIdChange={(clientId) =>
                      updateActiveAccount({ clientId })
                    }
                    onSecretIdChange={(secretId) =>
                      updateActiveAccount({ secretId })
                    }
                  />
                ) : null}
              </div>

              <PayPalGuide isConnected={Boolean(activeAccount?.connected)} />
            </div>
          </div>

          {activeAccount?.connected ? (
            <ConnectedFooter
              isDefaultAccount={isDefaultAccount}
              onEditAccount={() => setAccountDialogMode("edit")}
              onDisconnect={() => setShowDisconnectModal(true)}
            />
          ) : (
            <PendingFooter
              canSave={canSave}
              onEditAccount={() => setAccountDialogMode("edit")}
              onSave={handleSave}
            />
          )}
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
  isDefault,
  activeAccountConnected,
  onSelectAccount,
  onAddAccount,
  onSetAsDefault,
  onOpenPaymentMethods,
}: {
  item: IntegrationItem
  accounts: PayPalAccount[]
  activeAccountId: string | null
  defaultAccountId: string | null
  isDefault: boolean
  activeAccountConnected: boolean
  onSelectAccount: (id: string) => void
  onAddAccount: () => void
  onSetAsDefault: () => void
  onOpenPaymentMethods: () => void
}) {
  const activeIsDefaultAccount =
    isDefault && activeAccountId !== null && activeAccountId === defaultAccountId
  const setAsDefaultState = getSetAsDefaultDisabledReason({
    multiAccount: true,
    isDefault,
    activeAccountConnected,
    activeIsDefaultAccount,
  })
  const setAsDefaultTooltip = getSetAsDefaultTooltip({
    providerName: item.name,
    multiAccount: true,
    disabled: setAsDefaultState.disabled,
    reason: setAsDefaultState.reason,
  })
  const addAccountState = getAddAccountButtonState({
    accountsCount: accounts.length,
    hasConnectedAccount: accounts.some((account) => account.connected),
    requireConnectedBeforeAdd: true,
  })
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

          {activeAccountConnected ? (
            <>
              <div className="ml-auto" />

              <div className="flex shrink-0 items-center gap-2">
                <SetAsDefaultButton
                  disabled={setAsDefaultState.disabled}
                  tooltip={setAsDefaultTooltip}
                  onClick={onSetAsDefault}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={onOpenPaymentMethods}
                  className={cn(
                    "h-9 gap-2 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 shadow-none",
                    "border-[#84adff] bg-white text-[#004eeb] shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
                    "hover:border-[#84adff] hover:bg-[#f5f8ff] hover:text-[#004eeb]"
                  )}
                >
                  <Settings2 className="size-4" strokeWidth={1.75} aria-hidden />
                  Payment methods
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1" />
          )}
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
  accounts: PayPalAccount[]
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

function PendingFooter({
  canSave,
  onEditAccount,
  onSave,
}: {
  canSave: boolean
  onEditAccount: () => void
  onSave: () => void
}) {
  return (
    <footer className="flex flex-col gap-3 pt-0">
      <Separator className="bg-[#eaecf0]" />
      <div className="flex items-center justify-between px-6 pb-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEditAccount}
          className={cn(
            "h-9 gap-2 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 shadow-none",
            "border-[#d0d5dd] bg-white text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
            "hover:bg-[#f9fafb]"
          )}
        >
          <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
          Edit account
        </Button>
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

function ConnectedFooter({
  isDefaultAccount,
  onEditAccount,
  onDisconnect,
}: {
  isDefaultAccount: boolean
  onEditAccount: () => void
  onDisconnect: () => void
}) {
  const disconnectButton = (
    <Button
      type="button"
      variant="outline"
      aria-disabled={isDefaultAccount}
      onClick={isDefaultAccount ? undefined : onDisconnect}
      className={cn(
        "h-9 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6",
        "shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        isDefaultAccount
          ? "cursor-not-allowed border-[#fecdca] bg-white text-[#fda29b] hover:border-[#fecdca] hover:bg-white hover:text-[#fda29b]"
          : "border-[#fda29b] bg-white text-[#b42318] hover:border-[#f97066] hover:bg-[#fef3f2] hover:text-[#b42318]"
      )}
    >
      Disconnect
    </Button>
  )

  return (
    <footer className="flex flex-col gap-3 pt-0">
      <Separator className="bg-[#eaecf0]" />
      <div className="flex items-center justify-between px-6 pb-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEditAccount}
          className={cn(
            "h-9 gap-2 rounded px-2.5 font-[family-name:var(--font-inter)] text-base font-semibold leading-6 shadow-none",
            "border-[#d0d5dd] bg-white text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
            "hover:bg-[#f9fafb]"
          )}
        >
          <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
          Edit account
        </Button>
        {isDefaultAccount ? (
          <Tooltip>
            <TooltipTrigger asChild>{disconnectButton}</TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="max-w-[280px]">
              The provider is set as the default payment option. To disconnect,
              please select another provider as the default first.
            </TooltipContent>
          </Tooltip>
        ) : (
          disconnectButton
        )}
      </div>
    </footer>
  )
}
