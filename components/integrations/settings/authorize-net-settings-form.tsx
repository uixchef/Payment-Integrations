"use client"

import {
  ConnectionStatusTag,
  envPlaceholder,
  ModeSwitcher,
  SettingsFormLabel,
  SettingsTextInput,
  type IntegrationEnvironment,
} from "@/components/integrations/settings/integration-settings-fields"

export type AuthorizeNetFormState = {
  mode: IntegrationEnvironment
  loginId: string
  transactionKey: string
  signatureKey: string
}

export type AuthorizeNetFormProps = {
  isConnected: boolean
  isDefault?: boolean
  isReconnecting?: boolean
  state: AuthorizeNetFormState
  onStateChange: (next: AuthorizeNetFormState) => void
}

export function AuthorizeNetSettingsForm({
  isConnected,
  isDefault = false,
  isReconnecting = false,
  state,
  onStateChange,
}: AuthorizeNetFormProps) {
  const { mode, loginId, transactionKey, signatureKey } = state
  const readOnly = isConnected && !isReconnecting

  const update = (patch: Partial<AuthorizeNetFormState>) => {
    onStateChange({ ...state, ...patch })
  }

  return (
    <form
      className="flex w-full max-w-[656px] flex-col"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
            Authorize.net configuration
          </h2>
          <ConnectionStatusTag isConnected={isConnected} isDefault={isDefault} />
        </div>
        <ModeSwitcher value={mode} onChange={(next) => update({ mode: next })} />
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="authorize-login-id" required>
            Login id
          </SettingsFormLabel>
          <SettingsTextInput
            id="authorize-login-id"
            value={loginId}
            onChange={(next) => update({ loginId: next })}
            placeholder={envPlaceholder(mode, "login id")}
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="authorize-transaction-key" required>
            Transaction key
          </SettingsFormLabel>
          <SettingsTextInput
            id="authorize-transaction-key"
            type="password"
            value={transactionKey}
            onChange={(next) => update({ transactionKey: next })}
            placeholder={envPlaceholder(mode, "transaction key")}
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1">
          <SettingsFormLabel htmlFor="authorize-signature-key" required>
            Signature key
          </SettingsFormLabel>
          <SettingsTextInput
            id="authorize-signature-key"
            type="password"
            value={signatureKey}
            onChange={(next) => update({ signatureKey: next })}
            placeholder={envPlaceholder(mode, "signature key")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </form>
  )
}
