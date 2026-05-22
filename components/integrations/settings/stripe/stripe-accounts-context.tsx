"use client"

import * as React from "react"

import type { StripeAccount } from "@/components/integrations/settings/stripe/stripe-account-config"

const SEEDED_ACCOUNT: StripeAccount = {
  id: "account-1",
  label: "Account 1",
  connected: true,
  name: "Sarthak Goyal",
  email: "sarthak.goyal@uixchef.com",
  merchantId: "acct_1234abc5678xyz",
  totalBalance: "$ -8.63 USD",
  applePayEnabled: true,
  mode: "live",
}

const SEED_OAUTH_FIELDS: Pick<
  StripeAccount,
  "name" | "email" | "totalBalance" | "applePayEnabled" | "mode"
> = {
  name: "Sarthak Goyal",
  email: "sarthak.goyal@uixchef.com",
  totalBalance: "$ 0.00 USD",
  applePayEnabled: true,
  mode: "live",
}

function generateMerchantId(): string {
  const suffix = Math.random().toString(36).slice(2, 14).padEnd(12, "x")
  return `acct_${suffix}`
}

function newPendingAccount(label: string, index: number): StripeAccount {
  return {
    id: `account-${index}`,
    label,
    connected: false,
    name: "",
    email: "",
    merchantId: "",
    totalBalance: "",
    applePayEnabled: false,
    mode: "live",
  }
}

type StripeAccountsContextValue = {
  accounts: StripeAccount[]
  activeAccountId: string | null
  activeAccount: StripeAccount | null
  defaultAccountId: string | null

  setActiveAccountId: (id: string | null) => void
  setDefaultAccountId: (id: string | null) => void

  /** Seed the first account (called on first-time Connect). Returns the seeded account. */
  ensureSeededOnConnect: () => StripeAccount
  /** Complete OAuth on the active pending account. Returns true if something happened. */
  completeActiveAccountOAuth: () => boolean
  /** Add a pending account named `label`, make it active, return it. */
  addPendingAccount: (label: string) => StripeAccount
  /** Rename the active account. */
  renameActiveAccount: (label: string) => void
  /** Patch arbitrary fields on the active account. */
  updateActiveAccount: (patch: Partial<StripeAccount>) => void
  /**
   * Remove the active account. Also clears `defaultAccountId` when it was the
   * one being removed. Returns the new account count and the id of the next
   * tab the consumer should select (null when the list is now empty).
   */
  removeActiveAccount: () => {
    remainingCount: number
    nextActiveAccountId: string | null
  }
}

const StripeAccountsContext = React.createContext<
  StripeAccountsContextValue | undefined
>(undefined)

export function StripeAccountsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [accounts, setAccounts] = React.useState<StripeAccount[]>([])
  const [activeAccountId, setActiveAccountId] = React.useState<string | null>(
    null
  )
  const [defaultAccountId, setDefaultAccountId] = React.useState<string | null>(
    null
  )

  const activeAccount = React.useMemo(
    () => accounts.find((account) => account.id === activeAccountId) ?? null,
    [accounts, activeAccountId]
  )

  const ensureSeededOnConnect = React.useCallback<
    StripeAccountsContextValue["ensureSeededOnConnect"]
  >(() => {
    setAccounts([SEEDED_ACCOUNT])
    setActiveAccountId(SEEDED_ACCOUNT.id)
    return SEEDED_ACCOUNT
  }, [])

  const completeActiveAccountOAuth = React.useCallback<
    StripeAccountsContextValue["completeActiveAccountOAuth"]
  >(() => {
    if (!activeAccount || activeAccount.connected) return false
    const merchantId = generateMerchantId()
    setAccounts((current) =>
      current.map((account) =>
        account.id === activeAccount.id
          ? { ...account, ...SEED_OAUTH_FIELDS, merchantId, connected: true }
          : account
      )
    )
    return true
  }, [activeAccount])

  const addPendingAccount = React.useCallback<
    StripeAccountsContextValue["addPendingAccount"]
  >(
    (label) => {
      const account = newPendingAccount(label, accounts.length + 1)
      setAccounts((current) => [...current, account])
      setActiveAccountId(account.id)
      return account
    },
    [accounts.length]
  )

  const renameActiveAccount = React.useCallback<
    StripeAccountsContextValue["renameActiveAccount"]
  >(
    (label) => {
      if (!activeAccount) return
      setAccounts((current) =>
        current.map((account) =>
          account.id === activeAccount.id ? { ...account, label } : account
        )
      )
    },
    [activeAccount]
  )

  const updateActiveAccount = React.useCallback<
    StripeAccountsContextValue["updateActiveAccount"]
  >(
    (patch) => {
      if (!activeAccount) return
      setAccounts((current) =>
        current.map((account) =>
          account.id === activeAccount.id ? { ...account, ...patch } : account
        )
      )
    },
    [activeAccount]
  )

  const removeActiveAccount = React.useCallback<
    StripeAccountsContextValue["removeActiveAccount"]
  >(() => {
    const remaining = accounts.filter(
      (account) => account.id !== activeAccountId
    )

    if (activeAccountId === defaultAccountId) {
      setDefaultAccountId(null)
    }

    if (remaining.length === 0) {
      setAccounts([])
      setActiveAccountId(null)
      return { remainingCount: 0, nextActiveAccountId: null }
    }

    setAccounts(remaining)
    setActiveAccountId(remaining[0].id)
    return {
      remainingCount: remaining.length,
      nextActiveAccountId: remaining[0].id,
    }
  }, [accounts, activeAccountId, defaultAccountId])

  const value = React.useMemo<StripeAccountsContextValue>(
    () => ({
      accounts,
      activeAccountId,
      activeAccount,
      defaultAccountId,
      setActiveAccountId,
      setDefaultAccountId,
      ensureSeededOnConnect,
      completeActiveAccountOAuth,
      addPendingAccount,
      renameActiveAccount,
      updateActiveAccount,
      removeActiveAccount,
    }),
    [
      accounts,
      activeAccountId,
      activeAccount,
      defaultAccountId,
      ensureSeededOnConnect,
      completeActiveAccountOAuth,
      addPendingAccount,
      renameActiveAccount,
      updateActiveAccount,
      removeActiveAccount,
    ]
  )

  return (
    <StripeAccountsContext.Provider value={value}>
      {children}
    </StripeAccountsContext.Provider>
  )
}

export function useStripeAccounts(): StripeAccountsContextValue {
  const value = React.useContext(StripeAccountsContext)
  if (!value) {
    throw new Error(
      "useStripeAccounts must be used within a StripeAccountsProvider"
    )
  }
  return value
}
