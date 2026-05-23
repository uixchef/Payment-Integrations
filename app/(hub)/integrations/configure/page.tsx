import type { Metadata } from "next"
import { ProviderConfigurationShell } from "@/components/integrations/configure/provider-configuration-shell"

export const metadata: Metadata = {
  title: "Manage provider configuration | Payment Hub",
  description:
    "Choose a default payment provider per channel across your workflows.",
}

export default function ProviderConfigurationPage() {
  return <ProviderConfigurationShell />
}
