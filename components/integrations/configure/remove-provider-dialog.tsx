"use client"

import { Trash2 } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useProviderAccountLabelMap } from "@/components/integrations/configure/use-provider-account-labels"
import {
  getPaymentChannelById,
  useProviderConfiguration,
} from "@/lib/provider-configuration-context"
import { getProviderRemovalDisplayName } from "@/lib/provider-configuration-options"

export function RemoveProviderDialog() {
  const accountLabels = useProviderAccountLabelMap()
  const {
    assignments,
    pendingRemoval,
    cancelRemoveProvider,
    confirmRemoveProvider,
  } = useProviderConfiguration()

  const channel = pendingRemoval
    ? getPaymentChannelById(pendingRemoval.channelId)
    : undefined
  const providerName = pendingRemoval
    ? getProviderRemovalDisplayName(pendingRemoval.optionId, accountLabels)
    : ""
  const channelName = channel?.name ?? ""

  const assignedProviders = pendingRemoval
    ? (assignments[pendingRemoval.channelId] ?? [])
    : []
  const isLastProviderOnChannel =
    pendingRemoval !== null &&
    assignedProviders.length === 1 &&
    assignedProviders[0] === pendingRemoval.optionId

  if (isLastProviderOnChannel) {
    return (
      <ConfirmationDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => {
          if (!open) cancelRemoveProvider()
        }}
        title="Reset provider"
        description={
          <>
            Are you sure you want to remove the &lsquo;{providerName}&rsquo;
            provider? This will reset the configurations to the default payment
            provider settings.
          </>
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={confirmRemoveProvider}
        onCancel={cancelRemoveProvider}
      />
    )
  }

  return (
    <ConfirmationDialog
      open={pendingRemoval !== null}
      onOpenChange={(open) => {
        if (!open) cancelRemoveProvider()
      }}
      title="Remove provider"
      description={
        <>
          Are you sure you want to remove &lsquo;{providerName}&rsquo; as a
          provider for the &lsquo;{channelName}&rsquo; channel?
        </>
      }
      confirmLabel="Yes, remove"
      cancelLabel="Cancel"
      variant="destructive"
      icon={<Trash2 className="size-6" strokeWidth={1.75} aria-hidden />}
      onConfirm={confirmRemoveProvider}
      onCancel={cancelRemoveProvider}
    />
  )
}
