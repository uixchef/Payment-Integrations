export type PaymentChannel = {
  id: string
  name: string
}

export const MAX_PROVIDERS_PER_CHANNEL = 2

export const PAYMENT_CHANNELS: PaymentChannel[] = [
  { id: "invoices", name: "Invoices" },
  { id: "recurring-invoices", name: "Recurring invoices" },
  { id: "one-step-order-form", name: "One step order form" },
  { id: "two-step-order-form", name: "Two step order form" },
  { id: "forms", name: "Forms" },
  { id: "surveys", name: "Surveys" },
  { id: "invoices-2", name: "Invoices" },
  { id: "ecomm-stores", name: "Ecomm stores" },
  { id: "payment-links", name: "Payment links" },
  { id: "calendars", name: "Calendars" },
  { id: "courses", name: "Courses" },
  { id: "communities", name: "Communities" },
  { id: "surveys-2", name: "Surveys" },
]

/** Demo seed matching Figma "2 Provider" table variant. */
export const DEFAULT_TWO_PROVIDER_ASSIGNMENTS: Record<string, string[]> = {
  invoices: ["paypal:account-1", "square"],
  "recurring-invoices": ["paypal:account-2", "square"],
  "one-step-order-form": ["paypal:account-1", "nmi"],
  "two-step-order-form": ["paypal:account-2", "razorpay"],
  forms: ["paypal:account-2", "authorize-net"],
  surveys: ["paypal:account-2", "stripe"],
  "invoices-2": ["paypal:account-1", "gocardless"],
  "ecomm-stores": ["paypal:account-1", "paypal:account-2"],
  "payment-links": ["paypal:account-2", "stripe"],
  calendars: ["paypal:account-1", "gocardless"],
  courses: ["paypal:account-3", "authorize-net"],
  communities: ["paypal:account-2", "nmi"],
  "surveys-2": ["paypal:account-2", "razorpay"],
}
