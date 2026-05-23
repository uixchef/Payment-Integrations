import type { RazorpayFormState } from "@/components/integrations/settings/razorpay-settings-form"

export const RAZORPAY_WEBHOOK_URL =
  "https://staging.backend.leadconnectorhq.com/razorpay/webhook"

export const INITIAL_RAZORPAY_CONFIG: RazorpayFormState = {
  mode: "test",
  keyId: "",
  secret: "",
  billing: "on-demand",
}

export const SEEDED_RAZORPAY_CONFIG: RazorpayFormState = {
  mode: "test",
  keyId: "rzp_test_SSB2S01Ja6PsSS",
  secret: "5xQ7Lm2RtY8nZv4WbCp9Fj3K",
  billing: "on-demand",
}
