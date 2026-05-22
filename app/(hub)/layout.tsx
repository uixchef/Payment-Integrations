import { PaymentHubShell } from "@/components/payment-hub/payment-hub-shell";
import { IntegrationCountriesProvider } from "@/components/integrations/integration-countries-context";
import { StripeAccountsProvider } from "@/components/integrations/settings/stripe/stripe-accounts-context";
import { IntegrationStatusProvider } from "@/lib/integration-status-context";
import { TooltipProvider } from "@/components/ui/tooltip";

// Hub shell reads `useSearchParams()` (Topbar tabs, integrations canvas tab),
// so the entire segment must render dynamically — no static prerender.
export const dynamic = "force-dynamic";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <IntegrationStatusProvider>
        <StripeAccountsProvider>
          <IntegrationCountriesProvider>
            <PaymentHubShell>{children}</PaymentHubShell>
          </IntegrationCountriesProvider>
        </StripeAccountsProvider>
      </IntegrationStatusProvider>
    </TooltipProvider>
  );
}
