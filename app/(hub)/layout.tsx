import { PaymentHubShell } from "@/components/payment-hub/payment-hub-shell";
import { IntegrationCountriesProvider } from "@/components/integrations/integration-countries-context";
import { IntegrationStatusProvider } from "@/lib/integration-status-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <IntegrationStatusProvider>
        <IntegrationCountriesProvider>
          <PaymentHubShell>{children}</PaymentHubShell>
        </IntegrationCountriesProvider>
      </IntegrationStatusProvider>
    </TooltipProvider>
  );
}
