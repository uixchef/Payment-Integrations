export type SetAsDefaultDisabledReason =
  | "not-connected"
  | "already-default-account"
  | "already-default-provider"

export const DEFAULT_ACCOUNT_DISCONNECT_TOOLTIP =
  "This provider (or account) is set as default. To disconnect, select another provider (or account) as the default first."

export const DISCONNECT_ACCOUNT_DESCRIPTION =
  "Payments in flight will continue. New payments fall back to the default provider (or account)."

export function getSetAsDefaultTooltip({
  providerName,
  multiAccount = false,
  disabled,
  reason,
}: {
  providerName: string
  multiAccount?: boolean
  disabled: boolean
  reason?: SetAsDefaultDisabledReason
}): string {
  if (disabled) {
    switch (reason) {
      case "not-connected":
        return multiAccount
          ? "Connect this account to set it as the default provider."
          : `Connect ${providerName} to set it as the default provider.`
      case "already-default-account":
        return `This is already the default account for ${providerName}.`
      case "already-default-provider":
        return `${providerName} is already the default provider.`
      default:
        return multiAccount
          ? "Connect this account to set it as the default provider."
          : `Connect ${providerName} to set it as the default provider.`
    }
  }

  return multiAccount
    ? `Use this ${providerName} account for new payments and invoices. Turn off to remove it as the default.`
    : `Use ${providerName} as your primary provider for new payment channels.`
}

export function getSetAsDefaultDisabledReason({
  multiAccount,
  isConnected = false,
  isDefault,
  activeAccountConnected,
  activeIsDefaultAccount,
}: {
  multiAccount?: boolean
  isConnected?: boolean
  isDefault: boolean
  activeAccountConnected?: boolean
  activeIsDefaultAccount?: boolean
}): {
  disabled: boolean
  reason?: SetAsDefaultDisabledReason
} {
  if (multiAccount) {
    if (!activeAccountConnected) {
      return { disabled: true, reason: "not-connected" }
    }
    return { disabled: false }
  }

  if (!isConnected) {
    return { disabled: true, reason: "not-connected" }
  }
  if (isDefault) {
    return { disabled: true, reason: "already-default-provider" }
  }
  return { disabled: false }
}
