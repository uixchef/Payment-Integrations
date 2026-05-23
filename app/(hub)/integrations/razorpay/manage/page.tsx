import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RazorpayManageShell } from "@/components/integrations/settings/razorpay/razorpay-manage-shell"
import { INTEGRATIONS } from "@/lib/integrations-data"

export const metadata: Metadata = {
  title: "Razorpay app | Payment Hub",
  description: "Manage Razorpay authentication and billing configuration",
}

export default function RazorpayManagePage() {
  const item = INTEGRATIONS.find((entry) => entry.id === "razorpay")

  if (!item) {
    notFound()
  }

  return <RazorpayManageShell item={item} />
}
