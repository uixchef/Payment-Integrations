"use client"

import * as React from "react"

import type { PayPalAccount } from "@/components/integrations/settings/paypal/paypal-account-config"
import { MAX_ACCOUNTS_PER_PROVIDER } from "@/lib/integration-account-limits"

const OAUTH_FIELDS: Pick<
  PayPalAccount,
  "name" | "email" | "totalBalance" | "mode"
> = {
  name: "Sarthak Goyal",
  email: "sarthak.goyal@gmail.com",
  totalBalance: "$200.00",
  mode: "live",
}

function generateMerchantId(): string {
  const suffix = Math.random().toString(36).slice(2, 14).padEnd(12, "x")
  return `acct_${suffix}`
}

function newPendingAccount(
  label: string,
  index: number,
  oauthFlow = false
): PayPalAccount {
  return {
    id: `account-${index}`,
    label,
    connected: false,
    oauthConnected: false,
    oauthFlow,
    clientId: "",
    secretId: "",
    merchantId: "",
    name: "",
    email: "",
    totalBalance: "",
    mode: "live",
  }
}

type PayPalAccountsContextValue = {
  accounts: PayPalAccount[]
  activeAccountId: string | null
  activeAccount: PayPalAccount | null
  defaultAccountId: string | null

  setActiveAccountId: (id: string | null) => void
  setDefaultAccountId: (id: string | null) => void

  ensureInitialAccount: () => PayPalAccount
  addPendingAccount: (label: string) => PayPalAccount
  renameActiveAccount: (label: string) => void
  updateActiveAccount: (patch: Partial<PayPalAccount>) => void
  connectActiveAccount: () => boolean
  completeActiveAccountOAuth: () => boolean
  reconnectActiveAccount: () => boolean
  removeActiveAccount: () => {
    remainingCount: number
    nextActiveAccountId: string | null
  }
}

const PayPalAccountsContext = React.createContext<
  PayPalAccountsContextValue | undefined
>(undefined)

const INITIAL_ACCOUNT = newPendingAccount("Account 1", 1)

export function PayPalAccountsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [accounts, setAccounts] = React.useState<PayPalAccount[]>([
    INITIAL_ACCOUNT,
  ])
  const [activeAccountId, setActiveAccountId] = React.useState<string | null>(
    INITIAL_ACCOUNT.id
  )
  const [defaultAccountId, setDefaultAccountId] = React.useState<string | null>(
    null
  )

  const activeAccount = React.useMemo(
    () => accounts.find((account) => account.id === activeAccountId) ?? null,
    [accounts, activeAccountId]
  )

  const ensureInitialAccount = React.useCallback<
    PayPalAccountsContextValue["ensureInitialAccount"]
  >(() => {
    if (accounts.length > 0 && activeAccount) {
      return activeAccount
    }

    const account = newPendingAccount("Account 1", 1)
    setAccounts([account])
    setActiveAccountId(account.id)
    return account
  }, [accounts.length, activeAccount])

  const addPendingAccount = React.useCallback<
    PayPalAccountsContextValue["addPendingAccount"]
  >(
    (label) => {
      if (accounts.length >= MAX_ACCOUNTS_PER_PROVIDER) {
        return activeAccount ?? accounts[0]
      }
      const useOAuthFlow = accounts.some(
        (account) => account.connected && account.oauthConnected
      )
      const account = newPendingAccount(label, accounts.length + 1, useOAuthFlow)
      setAccounts((current) => [...current, account])
      setActiveAccountId(account.id)
      return account
    },
    [accounts, activeAccount]
  )

  const renameActiveAccount = React.useCallback<
    PayPalAccountsContextValue["renameActiveAccount"]
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
    PayPalAccountsContextValue["updateActiveAccount"]
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

  const connectActiveAccount = React.useCallback<
    PayPalAccountsContextValue["connectActiveAccount"]
  >(() => {
    if (!activeAccount || activeAccount.connected) return false
    if (!activeAccount.clientId.trim() || !activeAccount.secretId.trim()) {
      return false
    }

    const merchantId = generateMerchantId()
    setAccounts((current) =>
      current.map((account) =>
        account.id === activeAccount.id
          ? {
              ...account,
              merchantId,
              connected: true,
              oauthConnected: false,
            }
          : account
      )
    )
    return true
  }, [activeAccount])

  const completeActiveAccountOAuth = React.useCallback<
    PayPalAccountsContextValue["completeActiveAccountOAuth"]
  >(() => {
    if (!activeAccount || activeAccount.connected) return false

    const merchantId = generateMerchantId()
    setAccounts((current) =>
      current.map((account) =>
        account.id === activeAccount.id
          ? {
              ...account,
              ...OAUTH_FIELDS,
              merchantId,
              connected: true,
              oauthConnected: true,
            }
          : account
      )
    )
    return true
  }, [activeAccount])

  const reconnectActiveAccount = React.useCallback<
    PayPalAccountsContextValue["reconnectActiveAccount"]
  >(() => {
    if (!activeAccount?.connected || activeAccount.oauthConnected) return false

    setAccounts((current) =>
      current.map((account) =>
        account.id === activeAccount.id
          ? {
              ...account,
              connected: false,
              oauthConnected: false,
              oauthFlow: true,
              clientId: "",
              secretId: "",
              merchantId: "",
              name: "",
              email: "",
              totalBalance: "",
            }
          : account
      )
    )
    return true
  }, [activeAccount])

  const removeActiveAccount = React.useCallback<
    PayPalAccountsContextValue["removeActiveAccount"]
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

  const value = React.useMemo<PayPalAccountsContextValue>(
    () => ({
      accounts,
      activeAccountId,
      activeAccount,
      defaultAccountId,
      setActiveAccountId,
      setDefaultAccountId,
      ensureInitialAccount,
      addPendingAccount,
      renameActiveAccount,
      updateActiveAccount,
      connectActiveAccount,
      completeActiveAccountOAuth,
      reconnectActiveAccount,
      removeActiveAccount,
    }),
    [
      accounts,
      activeAccountId,
      activeAccount,
      defaultAccountId,
      ensureInitialAccount,
      addPendingAccount,
      renameActiveAccount,
      updateActiveAccount,
      connectActiveAccount,
      completeActiveAccountOAuth,
      reconnectActiveAccount,
      removeActiveAccount,
    ]
  )

  return (
    <PayPalAccountsContext.Provider value={value}>
      {children}
    </PayPalAccountsContext.Provider>
  )
}

export function usePayPalAccounts(): PayPalAccountsContextValue {
  const value = React.useContext(PayPalAccountsContext)
  if (!value) {
    throw new Error(
      "usePayPalAccounts must be used within a PayPalAccountsProvider"
    )
  }
  return value
}
