export const MAX_ACCOUNTS_PER_PROVIDER = 8

export const MAX_ACCOUNTS_TOOLTIP =
  "You can add up to 8 accounts per provider. To add a new one, please remove an existing account first."

export const CONNECT_FIRST_ACCOUNT_TOOLTIP =
  "Connect your first account before adding another one."

export function getAddAccountButtonState({
  accountsCount,
  hasConnectedAccount,
  requireConnectedBeforeAdd = false,
}: {
  accountsCount: number
  hasConnectedAccount: boolean
  requireConnectedBeforeAdd?: boolean
}): { disabled: boolean; disabledReason?: string } {
  if (accountsCount >= MAX_ACCOUNTS_PER_PROVIDER) {
    return { disabled: true, disabledReason: MAX_ACCOUNTS_TOOLTIP }
  }

  if (requireConnectedBeforeAdd && !hasConnectedAccount) {
    return {
      disabled: true,
      disabledReason: CONNECT_FIRST_ACCOUNT_TOOLTIP,
    }
  }

  return { disabled: false }
}
