import type { AuthorizeNetFormState } from "@/components/integrations/settings/authorize-net-settings-form"

export const INITIAL_AUTHORIZE_NET: AuthorizeNetFormState = {
  mode: "live",
  loginId: "",
  transactionKey: "",
  signatureKey: "",
}

export const SEEDED_AUTHORIZE_NET: AuthorizeNetFormState = {
  mode: "live",
  loginId: "9pX2vQ4Tn",
  transactionKey: "5KmRtY8wZb2NvCp9Fj3LqHsXdA",
  signatureKey:
    "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2",
}

export const AUTHORIZE_NET_DOCS =
  "https://help.gohighlevel.com/support/solutions/articles/48000980324-authorize-net-integration"
