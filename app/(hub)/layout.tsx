import { PaymentHubShell } from "@/components/payment-hub/payment-hub-shell";
import { IntegrationCountriesProvider } from "@/components/integrations/integration-countries-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <IntegrationCountriesProvider>
        <PaymentHubShell>{children}</PaymentHubShell>
      </IntegrationCountriesProvider>
    </TooltipProvider>
  );
}
