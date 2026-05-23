import { PaymentHubShell } from "@/components/payment-hub/payment-hub-shell";
import { IntegrationCountriesProvider } from "@/components/integrations/integration-countries-context";
import { PayPalAccountsProvider } from "@/components/integrations/settings/paypal/paypal-accounts-context";
import { StripeAccountsProvider } from "@/components/integrations/settings/stripe/stripe-accounts-context";
import { IntegrationStatusProvider } from "@/lib/integration-status-context";
import { ProviderConfigurationProvider } from "@/lib/provider-configuration-context";
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
          <PayPalAccountsProvider>
            <ProviderConfigurationProvider>
              <IntegrationCountriesProvider>
                <PaymentHubShell>{children}</PaymentHubShell>
              </IntegrationCountriesProvider>
            </ProviderConfigurationProvider>
          </PayPalAccountsProvider>
        </StripeAccountsProvider>
      </IntegrationStatusProvider>
    </TooltipProvider>
  );
}
