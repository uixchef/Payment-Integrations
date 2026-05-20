import { PaymentHubShell } from "@/components/payment-hub/payment-hub-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <PaymentHubShell>{children}</PaymentHubShell>
    </TooltipProvider>
  );
}
