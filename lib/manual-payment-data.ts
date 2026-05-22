export type ManualPaymentTab = "cash-on-delivery" | "custom-payment"

export type ManualPaymentMethodStatus = "not-configured" | "configuring" | "enabled"

export type ManualPaymentEnableFor = {
  orderForm: boolean
  ecommerce: boolean
  forms: boolean
  surveys: boolean
}

export type ManualPaymentMethodForm = {
  name: string
  paymentInstructions: string
  message: string
  enableFor: ManualPaymentEnableFor
}

export type ManualPaymentMethodState = ManualPaymentMethodForm & {
  status: ManualPaymentMethodStatus
}

export const MANUAL_PAYMENT_MAX_CHARS = 100

export const ENABLE_FOR_OPTIONS: {
  key: keyof ManualPaymentEnableFor
  label: string
}[] = [
  { key: "orderForm", label: "Order form" },
  { key: "ecommerce", label: "E-commerce stores" },
  { key: "forms", label: "Forms" },
  { key: "surveys", label: "Surveys" },
]

export type ManualPaymentEmptyStateContent = {
  title: string
  description: string
  enableLabel: string
  illustration: "truck" | "wallet"
  tiles: { icon: "check" | "card" | "banknote"; text: string }[]
}

export type ManualPaymentGuideStep = {
  number: number
  lead: string
  body: string
}

export const MANUAL_PAYMENT_EMPTY: Record<
  ManualPaymentTab,
  ManualPaymentEmptyStateContent
> = {
  "cash-on-delivery": {
    title: "Cash on delivery not configured.",
    description:
      "Allow your customers to pay in cash upon receiving their order. This method is perfect for local deliveries and face-to-face transactions where payment is made at the time of delivery.",
    enableLabel: "Enable cash on delivery",
    illustration: "truck",
    tiles: [
      { icon: "check", text: "Simple, no-setup payment option." },
      { icon: "card", text: "Ideal for local or in-person deliveries." },
      { icon: "banknote", text: "No fees charged by payment processors." },
    ],
  },
  "custom-payment": {
    title: "Custom payment method not configured",
    description:
      "Create a manual payment option tailored for unique arrangements. This can include bank transfers, checks, in-store payments, or any alternative payment method you wish to provide.",
    enableLabel: "Enable custom payment",
    illustration: "wallet",
    tiles: [
      {
        icon: "check",
        text: "Completely customizable payment method name and instructions.",
      },
      {
        icon: "card",
        text: "Ideal for offline or region-specific payment options.",
      },
      { icon: "banknote", text: "No transaction fees from payment processors." },
    ],
  },
}

export const MANUAL_PAYMENT_FIELD_HELPER = {
  instructions: "Shown while customers are choosing a payment method.",
  message: "Shown after the customer places an order.",
} as const

export const MANUAL_PAYMENT_GUIDE: Record<ManualPaymentTab, ManualPaymentGuideStep[]> =
  {
    "cash-on-delivery": [
      {
        number: 1,
        lead: "Set clear delivery terms – ",
        body: "Inform customers about when and how they should make payments.",
      },
      {
        number: 2,
        lead: "Verify payment readiness – ",
        body: "Make sure the delivery team can manage cash transactions efficiently.",
      },
      {
        number: 3,
        lead: "Include payment reminders – ",
        body: "Utilize invoice notes or confirmation emails to remind customers of their payment due upon delivery.",
      },
    ],
    "custom-payment": [
      {
        number: 1,
        lead: "Name the method clearly – ",
        body: 'Use titles like "Bank transfer," "Pay in store," or "Cheque payment."',
      },
      {
        number: 2,
        lead: "Provide step-by-step instructions – ",
        body: "Include account details, reference numbers, or store address.",
      },
      {
        number: 3,
        lead: "Confirm payment receipt – ",
        body: "Mark orders as paid once verified.",
      },
    ],
  }

export const MANUAL_PAYMENT_DOCS =
  "https://help.gohighlevel.com/support/solutions/articles/48000980325-manual-payment-methods"

export function createInitialMethodState(
  tab: ManualPaymentTab
): ManualPaymentMethodState {
  return {
    status: "not-configured",
    name: tab === "cash-on-delivery" ? "Cash on Delivery (COD)" : "",
    paymentInstructions: "",
    message: "",
    enableFor: {
      orderForm: false,
      ecommerce: false,
      forms: false,
      surveys: false,
    },
  }
}

export function methodFormKey(form: ManualPaymentMethodForm): string {
  return JSON.stringify(form)
}

export function canSaveManualMethod(
  tab: ManualPaymentTab,
  form: ManualPaymentMethodForm
): boolean {
  if (tab === "custom-payment" && form.name.trim().length === 0) {
    return false
  }

  const hasInstructions = form.paymentInstructions.trim().length > 0
  const hasMessage = form.message.trim().length > 0
  const hasAnyEnableFor = Object.values(form.enableFor).some((value) => value)

  return hasInstructions || hasMessage || hasAnyEnableFor
}

export type ManualPaymentTabMeta = {
  id: ManualPaymentTab
  label: string
  formTitle: string
  nameReadOnly: boolean
  namePlaceholder: string
  instructionsPlaceholder: string
  messagePlaceholder: string
}

export const MANUAL_PAYMENT_TABS: ManualPaymentTabMeta[] = [
  {
    id: "cash-on-delivery",
    label: "Cash on delivery",
    formTitle: "Cash on delivery",
    nameReadOnly: true,
    namePlaceholder: "Cash on Delivery (COD)",
    instructionsPlaceholder: "Explain how customers should pay on delivery",
    messagePlaceholder: "Message customers after they place an order",
  },
  {
    id: "custom-payment",
    label: "Custom payment",
    formTitle: "Custom payment",
    nameReadOnly: false,
    namePlaceholder: "Enter payment method name",
    instructionsPlaceholder: "Add step-by-step payment instructions",
    messagePlaceholder: "Add a confirmation message for customers",
  },
]

export function getTabMeta(tab: ManualPaymentTab): ManualPaymentTabMeta {
  return MANUAL_PAYMENT_TABS.find((entry) => entry.id === tab)!
}
