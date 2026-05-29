import type { RazorpayFormState } from "@/components/integrations/settings/razorpay-settings-form"

export const RAZORPAY_WEBHOOK_URL =
  "https://staging.backend.leadconnectorhq.com/razorpay/webhook"

export const RAZORPAY_DOCS =
  "https://help.gohighlevel.com/support/solutions/articles/48000980323-razorpay-integration"

export const INITIAL_RAZORPAY: RazorpayFormState = {
  mode: "live",
  keyId: "",
  secret: "",
  billing: "fixed",
}

export const SEEDED_RAZORPAY: RazorpayFormState = {
  mode: "live",
  keyId: "rzp_live_K8pX2J9aQ4mNvW",
  secret: "5xQ7Lm2RtY8nZv4WbCp9Fj3K",
  billing: "fixed",
}

/** Manage app shell — test credentials preset. */
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
