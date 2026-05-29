"use client"

import { ToggleCard } from "./sync-primitives"

export type ScanConfig = {
  importSubscriptions: boolean
  contactPaymentMethodSync: boolean
}

export function StepScanConfigure({
  config,
  onChange,
}: {
  config: ScanConfig
  onChange: (next: ScanConfig) => void
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold leading-6 text-[#101828]">
          Select objects from Stripe
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-sm leading-5 text-[#475467]">
          Select the Stripe objects you want to import. Importing related objects
          together improves associations.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <ToggleCard
          iconKey="import-subscriptions"
          title="Import subscriptions"
          checked={config.importSubscriptions}
          onCheckedChange={(next) =>
            onChange({ ...config, importSubscriptions: next })
          }
        />
        <ToggleCard
          iconKey="contact-payment-method-sync"
          title="Contact & payment method sync"
          checked={config.contactPaymentMethodSync}
          onCheckedChange={(next) =>
            onChange({ ...config, contactPaymentMethodSync: next })
          }
        />
      </div>
    </div>
  )
}
