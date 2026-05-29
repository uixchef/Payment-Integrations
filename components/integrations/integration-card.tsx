"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IntegrationAvailability } from "@/components/integrations/integration-availability"
import { IntegrationProviderIdentity } from "@/components/integrations/integration-provider-identity"
import { useIntegrationStatus } from "@/lib/integration-status-context"
import {
  getIntegrationCtaHref,
  providerHasSettings,
} from "@/lib/integration-cta-routes"
import type { IntegrationItem } from "@/lib/integrations-data"
import { cn } from "@/lib/utils"

export function IntegrationCard({ item }: { item: IntegrationItem }) {
  const { isConnected, isDefault } = useIntegrationStatus()
  const connected = isConnected(item.id)
  const defaultProvider = isDefault(item.id)
  const hasSettings = providerHasSettings(item.id)
  const ctaHref = getIntegrationCtaHref(item.id, connected)
  const ctaLabel = connected ? "Manage" : "Connect"

  const ctaClassName = cn(
    "w-full rounded border-[#d0d5dd] bg-white px-2.5 text-[#344054] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors",
    "group-hover:border-[#84adff] group-hover:bg-white group-hover:text-[#004eeb]",
    "hover:border-[#84adff] hover:bg-white hover:text-[#004eeb]"
  )

  return (
    <article
      className={cn(
        "group flex w-full flex-col rounded border border-[#d0d5dd] bg-white shadow-[0_1px_1.5px_rgba(16,24,40,0.1),0_1px_1px_rgba(16,24,40,0.06)] transition-colors",
        "[--card-surface-color:white] hover:border-[#84adff] hover:bg-[#f5f8ff] hover:[--card-surface-color:#f5f8ff]"
      )}
    >
      <div className="px-4 pt-4">
        <IntegrationProviderIdentity
          item={item}
          isDefault={defaultProvider}
          alignBadgesEnd
          nameClassName="min-w-0 flex-1 truncate text-base font-semibold leading-6 text-[#101828]"
        />
      </div>

      <div className="flex flex-col gap-4 p-4">
        <Separator className="bg-[#eaecf0] transition-colors group-hover:bg-[#d1e0ff]" />

        <div className="flex h-[88px] flex-col gap-4">
          <p className="line-clamp-2 h-12 overflow-hidden text-base leading-6 text-[#475467]">
            {item.methods}
          </p>
          <IntegrationAvailability item={item} />
        </div>

        {hasSettings && ctaHref ? (
          <Button asChild variant="outline" className={ctaClassName}>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" className={ctaClassName}>
            {ctaLabel}
          </Button>
        )}
      </div>
    </article>
  )
}
