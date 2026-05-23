import type { MercadoPagoFormState } from "@/components/integrations/settings/mercado-pago-settings-form"
import { getCountryLabel } from "@/lib/country-labels"

export type MercadoPagoCountry = {
  code: string
  label: string
}

/** Mercado Pago account countries supported in settings. */
export const MERCADO_PAGO_COUNTRIES: MercadoPagoCountry[] = [
  { code: "AR", label: getCountryLabel("AR") },
  { code: "BR", label: getCountryLabel("BR") },
  { code: "CL", label: getCountryLabel("CL") },
  { code: "CO", label: getCountryLabel("CO") },
  { code: "MX", label: getCountryLabel("MX") },
  { code: "PE", label: getCountryLabel("PE") },
  { code: "UY", label: getCountryLabel("UY") },
  { code: "US", label: "United States of America" },
]

export const INITIAL_MERCADO_PAGO: MercadoPagoFormState = {
  mode: "live",
  publicKey: "",
  accessToken: "",
  country: "",
  webhookSecret: "",
}

export const SEEDED_MERCADO_PAGO: MercadoPagoFormState = {
  mode: "live",
  publicKey: "dsfkneklf3er30i0bvi0ty05i0riuv9ewkdpoej",
  accessToken: "dsfkneklf3er30i0bvi0ty05i0riuv9ewkdpoej",
  country: "US",
  webhookSecret: "dsfkneklf3er30i0bvi0ty05i0riuv9ewkdpoej",
}
